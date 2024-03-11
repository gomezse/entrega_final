import { productsManager } from "../dao/models/mongoose/ProductsManager.js"
import { cartsManager } from "../dao/models/mongoose/CartsManager.js";
import { usersManager } from "../dao/models/mongoose/UsersManager.js";
import config from "../utils/config.js";
import jwt from "jsonwebtoken";
import {logger} from "../utils/logger.js"

const chat =async (req, res) => {
    const products = await productsManager.findAll(req.query);
    res.render("chat",{products,style:'index'});
  
  }


const products = async (req, res) => {
    const products = await productsManager.findAll(req.query);
    const {payload,totalPages,page,nextLink,prevLink,hasNextPage,hasPrevPage}=products;
    const productsObject = payload.map(product => product.toObject());

    res.render('home', { product : productsObject,page:page,next:nextLink,prev:prevLink,hasNext:hasNextPage,hasPrev:hasPrevPage,totalPages:totalPages });
  
  }

const cartId=  async (req, res) => {
    const {cid}=req.params;
    const cart = await cartsManager.getCartById(cid);
    const cartObject = cart.products.map(product => product.toObject());
  
    res.render('cart', { cart : cartObject});
  };

const login = (req, res) => {    
    if (req && req.cookies.user) {
        return res.redirect("/profile");
    }
    res.render("login");
};

const signup = (req, res) => {
    if (req.cookies.token) {
        return res.redirect("/profile");
    }
    res.render("signup");
}

const profile = async (req, res) => {
    
    if (!req.cookies.token) {
         
        return res.redirect("/login");
    }
    const user = jwt.verify(req.cookies.token, config.secretKeyJWT);
    // const user = await  usersManager.findById(req.session.passport.user);        
    const products = await productsManager.findAll(req.query);
   
    if (!products.payload.length) {
        return res.status(200).json({ message: 'No products' });
    } 
  
    const { payload } = products;
    
    const userDB = await usersManager.findByEmail(user.email);
    const id = userDB._id;
    const productsObject = payload.map(product => product.toObject());
    res.render("profile", { products: productsObject, user: req.user?req.user:user,id:id });
}

const restaurar =  (req, res) => {
    res.render("restaurar");
  };
  

const error= (req, res) => {
    const message = req;

    res.render("error",{message:message});
}

const errorLogin=(req, res) => {
    const message = req;
    res.render("error_login",{message:message});
  }

const message= (req, res) => {
    res.render("messages");
}  

const loggerTest = (req, res) => {
    //Todos los niveles de logger existentes.
    logger.fatal('Este es un mensaje fatal');
    logger.error('Este es un mensaje de error');
    logger.warning('Este es un mensaje de advertencia');
    logger.info('Este es un mensaje de información');
    logger.http('Este es un mensaje HTTP');
    logger.debug('Este es un mensaje de depuración');

    res.status(200).json({ message: 'Logger ejecutado.' });
}

const addProduct= (req, res) => {
    const   product={
            title:"",
            description:"",
            code:"",
            price:0,
            stock:0,
            category:"",        
            }             
//revisar que no sea un update...        
    res.render("product",{product:product});
}  

const updateProduct= async (req, res) => {
    
    // const user = jwt.verify(req.cookies.token, config.secretKeyJWT);
   
    const product = await productsManager.findById(req.params.pid);
   
    if (!product) {
        return res.status(400).json({ message: 'Producto not found' });
    } 
    productsManager.updateOne(req.params.pid, product);
    
    const productObject = product.toObject();
  
    res.render("product-update",{product:productObject});
} 

const deleteProduct= async (req, res) => {
    
    const user = jwt.verify(req.cookies.token, config.secretKeyJWT);
    
    const product = await productsManager.findById(req.params.pid);
    if (!product) {
        
        return res.status(400).json({ message: 'Product not found' });
    }

    if(user.role=='ADMIN'){
        const deletedProduct = productsManager.deleteOne(req.params.pid);
        return res.status(200).json({message: 'Product deleted by ADMIN',product:deletedProduct});    
    } 
    
    if(user.email != product.owner){
        return res.status(401).json({ message: 'You do not have permissions to remove this product' });
    } 
      
    
    const deletedProduct = productsManager.deleteOne(req.params.pid);
    return res.status(200).json({message: 'Product deleted by PREMIUM',product:deletedProduct});        
} 


const documents = async (req, res) => {
    
    if (!req.cookies.token) {         
        return res.redirect("/login");
    }
    const user = jwt.verify(req.cookies.token, config.secretKeyJWT); 
    const userCompleto = await usersManager.findByEmail(user.email);
    
    res.render("documents", {id:userCompleto._id});
}
export const viewRouter = {
    "chat":chat,
    "products":products,
    "cartId":cartId,
    "login":login,
    "signup":signup,
    "profile":profile,
    "restaurar":restaurar,
    "error":error,
    "errorLogin":errorLogin,
    "message":message,
    "loggerTest":loggerTest,
    "addProduct":addProduct,
    "updateProduct":updateProduct,
    "deleteProduct":deleteProduct,
    "documents":documents
}