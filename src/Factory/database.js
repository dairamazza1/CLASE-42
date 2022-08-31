class DataBaseFactory{
    getConnection(data) {
      if(data == 'firebase'){
        const { ProductoDaoFirebase } = require('../daos/productos/ProductosDaoFirebase');
        return ProductoDaoFirebase.getInstance();
      }  
      if(data == 'mongodb'){
        const { ProductoDaoMongoDB } = require('../daos/productos/ProductosDaoMongoDB');
        return  ProductoDaoMongoDB.getInstance();
      }  
      if(data == 'file'){
        const { ProductoDaoArchivo } = require('../daos/productos/ProductosDaoArchivo');
        return ProductoDaoArchivo.getInstance();
      } 

    }
}

module.exports = { DataBaseFactory }
