// EN LA RUTA SOLO SE ENCUENTRAN LAS DEFINICIONES Y DEBE COMUNICARSE CON CONTROLADORES

const { Router } = require('express');
const productRouter = Router();
const UserModel = require("../models/usuarios.js");
const productController = require('../controllers/products')
//const productMiddleware = require('../middleware/auth')

// AUTHORIZATION & AUTHENTICATION
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// DEPENDENCIAS
const {validatePass} = require('../../src/utils/passValidator');
const {createHash} = require('../../src/utils/hashGenerator')

productRouter.use(passport.initialize())
productRouter.use(passport.session())

passport.use('login', new LocalStrategy(
    (username, password, callback) => {
        UserModel.findOne({ username: username }, (err, user) => {
            if (err) {
                return callback(err)
            }

            if (!user) {
                //console.log('No se encontro usuario');
                return callback(null, false)
            }

            if(!validatePass(user, password)) {
                //console.log('Invalid Password');
                return callback(null, false)
            }

            return callback(null, user)
        })
    }
))


passport.use('signup', new LocalStrategy(
    {passReqToCallback: true}, (req, username, password, callback) => {
        UserModel.findOne({ username: username }, (err, user) => {
            if (err) {
                //console.log('Hay un error al registrarse');
                //console.log(UserModel);
                return callback(err)
            }
            if (user) {
                //console.log('El usuario ya existe');
                return callback(null, false)
            }

            console.log(req.body);

            const newUser = {
                username: username,
                password: createHash(password)
            }

            UserModel.create(newUser, (err, userWithId) => {
                if (err) {
                    //console.log('Hay un error al registrarse');
                    return callback(err)
                }

                //console.log(userWithId);
                //console.log('Registro de usuario satisfactoria');

                return callback(null, userWithId)
            })
        })
    }
))


passport.serializeUser((user, callback) => {
    callback(null, user._id)
})

passport.deserializeUser((id, callback) => {
    UserModel.findById(id, callback)
})
let product = new productController();
// HOME
productRouter.get('/',product.getRoot);

//  LOGIN
productRouter.get('/login', product.getLogin);
productRouter.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), product.postLogin);
productRouter.get('/faillogin', product.getFaillogin);

//  SIGNUP
productRouter.get('/signup', product.getSignup);
productRouter.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), product.postSignup);
productRouter.get('/failsignup', product.getFailsignup);

//  LOGOUT
productRouter.get('/logout', product.getLogout);

// PRODUCTS
productRouter.get('/products', product.getProducts);
productRouter.get('/products.data', product.getProductsData);

// INFO
productRouter.get("/info", product.getInfo)

// RAND
productRouter.get("/randoms", product.getRandom);

//  FAIL ROUTE
productRouter.get('*', product.failRoute);


class RoutesProduct {
    constructor(){
        return productRouter;
    }
}

module.exports = RoutesProduct 