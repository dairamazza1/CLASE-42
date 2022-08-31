// SE ENCUENTRAN LAS FUNCIONES DE REQUEST Y RESPONSE

//SERVICE
const Api = require('../services/products');

//INFO
const { info }= require("../utils/info");

//LOG4JS
const log4js = require("log4js");

//ROUTES

class Controller {
    constructor(){
        this.api = new Api();
    }

    getRoot(req, res) {
        res.render('pages/log', {main: true, login: false, signup : false, loginError: false, signupLogout: false , logout : false , error : false});
    }

    getLogin(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('products')
        } else {
            res.render('pages/log', {main: false, login: true, signup : false, loginError: false, signupLogout: false, logout : false , error : false});
        }
    }

    getSignup(req, res) {
        res.render('pages/log', {main: false, login: false, signup : true, loginError: false, signupLogout: false, logout : false , error : false});

    }

    postLogin (req, res) {
        if (req.isAuthenticated()) {
            res.redirect('products')
        } else {
            res.redirect('login')
        }
    }

    postSignup (req, res) {
        if (req.isAuthenticated()) {
            res.redirect('products')
        } else {
            res.redirect('login')
        }
    }

    getProducts = async(req, res) =>{
        if (req.isAuthenticated()) {
            let user = req.user;
            if(this.api.getProductsDLO() ){
                res.render( 'pages/index', {listExists: true, listNotExists: false, user: user, isUser : true, info: false})
            }
            else{
                res.render('pages/index', {listNotExists: true, listExists: false, user: user, isUser : true, info: false})
            }
        } else {
            res.redirect('login')
        }
    }
    getProductsData = async(req, res) =>{
        const getData = await this.api.getProductsDataDLO();
        res.json(getData);
    }
    getFaillogin = async(req, res) =>{
        console.log('error en login');
        res.render('pages/log', {main: false, login: false, signup : false, loginError: true, signupLogout: false, logout : false , error : false});
    }

    getFailsignup = async(req, res) =>{
        console.log('error en signup');
        res.render('pages/log', {main: false, login: false, signup : false, loginError: false, signupLogout: true, logout : false , error : false});
    }

    getLogout = async(req, res) =>{
        req.logout( (err) => {
            if (!err) {
                let user = req.body.name;
                res.render('pages/log', {main: false, login: false, signup : false, loginError: false, signupLogout: false, logout : true, name: user , error : false});
            } 
        });
    }

    failRoute = async(req, res) =>{
        const logger = log4js.getLogger("info");
        logger.info("Log Info: ",req.url);

        res.status(404).render('pages/log', {main: false, login: false, signup : false, loginError: false, signupLogout: false, logout : false , error : true});
    }

    getInfo = async(req, res) =>{
        const getObj  = info();
        res.render( 'pages/info', getObj )
    }
    getRandom = async(req, res) =>{
        let tittle = `Se han calculado en total ${num} numeros:`;
        let result = this.api.getRandomDLO(req.query.qty);
        res.render("pages/info", { info: false, random: true, tittle, result });
    }

}



module.exports = Controller ;