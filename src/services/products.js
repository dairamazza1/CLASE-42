//MODIFICA LA LÓGICA DE NEGOCIO DEL CONTROLADOR E INTERACTUA CON DAO

//CONEXIÓN DB definida x tercer parámetro CMD
const { DATA_CONNECT } = require('../config/globals')
let { DataBaseFactory } = require('../Factory/database');

// DTO
const { ProductDTO } = require('../DTO/ProductosDto');

//FORK
const { fork } = require("child_process");

class Api {
    constructor(){
        this.product = new DataBaseFactory().getConnection(DATA_CONNECT);
    }

    getProductsDLO = async() =>{
        let ret = false;
        const prod = await this.product.getAll().then( (obj) =>{
                obj.length > 0 ? ret = true : ret = false;
        }) 
        return ret;
    }
    getProductsDataDLO = async() =>{
        let ret = []
        const prod = await this.product.getAll().then( (obj) =>{
            const prodDtos = obj.map(producto => {
                return new ProductDTO(producto)
            })
           
            obj.length > 0 ? ret = {products: prodDtos} : ret = {products: {} }
        }) 
        return ret;
    }
    
    getRandomDLO = async(n) => {
        let num = null;
        const qtyAux = 1000;
        n == undefined ? num = qtyAux : num = n;
    
        const child = fork("./src/utils/randomsChild");
        child.send(num);
        child.on("message", (data) => {
            try {
                return JSON.parse(data);
            } catch (error) {
                const logger = log4js.getLogger("error");
                logger.info("Log error: ", error);
            }
        }); 
    }

}



module.exports = Api