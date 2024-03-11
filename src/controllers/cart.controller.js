import { cartsManager } from '../dao/models/mongoose/CartsManager.js';
import { cartService } from '../services/carts.service.js';
import CustomError from '../errors/error.generator.js';
import { ErrorsMessages,ErrorsName } from '../errors/error.enum.js';
import {logger} from "../utils/logger.js"
import config from "../utils/config.js";
import jwt from "jsonwebtoken";

const addCart =  async (req, res) => {
    try {
        const newCart = await cartsManager.createCart();
        logger.info('Cart created', { cartId: newCart._id });
        res.status(200).json({ status:"success",message: 'Cart created', cart: newCart });
    } catch (error) {
        logger.error('Error creating cart', { error: error.message });
        CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);        
    }
}

const getById=  async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartsManager.getCartById(cid);
        if (!cart) {
            logger.warn('Cart not found', { cartId: cid });
            CustomError.generateErrorMessage(ErrorsMessages.CART_NOT_FOUND,404,ErrorsName.CART_NOT_FOUND);        
        }
        logger.info('Cart found', { cartId: cid });
        res.status(200).json({ message: 'Cart found', cart });

    } catch (error) {
        logger.error('Error getting cart by ID', { cartId: cid, error: error.message });
        CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);        
    }
}

const addProductToCart= async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const user = jwt.verify(req.cookies.token, config.secretKeyJWT);
        if (user.role == 'PREMIUM' && user.email != req.body.email){
            return res.status(401).json({ message: 'You do not have permissions to add this product at cart' });
        }

        const newProduct = await cartsManager.addProductToCart(cid, pid);
        logger.info('Product added to cart', { cartId: cid, productId: pid });
        res.status(200).json({ message: 'Product added to cart', product: newProduct });
    } catch (error) {
        logger.error('Error adding product to cart', { cartId: cid, productId: pid, error: error.message });
        CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);        
    }
}

const deleteProduct = async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const deleteProduct = await cartsManager.removeProductToCart(cid, pid);
        logger.info('Product removed from cart', { cartId: cid, productId: pid });
        res.status(200).json({ message: 'Product remove to cart', product: deleteProduct });

    } catch (error) {
        logger.error('Error removing product from cart', { cartId: cid, productId: pid, error: error.message });
        CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);        
    }
}


const deleteAllProducts= async (req, res) => {
    const { cid} = req.params;

    try {
        const deleteProduct = await cartsManager.removeAllProductsToCart(cid);
        logger.info('All products removed from cart', { cartId: cid });
        res.status(200).json({ message: 'Products removed to cart', product: deleteProduct });

    } catch (error) {
        logger.error('Error removing all products from cart', { cartId: cid, error: error.message });
        CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);        
    }
}


const updateProductToCart = async (req, res) => {
    const { cid,pid } = req.params;
    const {quantity } = req.body;

    try {
        const updateResult = await cartsManager.updateQuantityProduct(cid,pid,quantity);

        if (updateResult) {            
            // Devuelve el producto actualizado en la respuesta
            logger.info('Product updated in cart', { cartId: cid, productId: pid, newQuantity: quantity });
            res.status(200).json({ message: 'Product updated', product: updateResult });
        } else {
            // En caso de que no se encuentre el producto para actualizar
            logger.fatal('Product not found for updating', { cartId: cid, productId: pid });
            CustomError.generateErrorMessage(ErrorsMessages.PRODUCT_NOT_FOUND,404,ErrorsName.PRODUCT_NOT_FOUND);        
        }
    } catch (error) {
        logger.error('Error updating product in cart', { cartId: cid, productId: pid, error: error.message });
        CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);        
    }
}


const updateAllProducts= async (req, res) => {
    const { cid} = req.params;
    const {products } = req.body;

    try {
        const updatedCart = await cartsManager.updateAllProducts(cid, products);     
        logger.info('All products updated in cart', { cartId: cid, updatedProducts: products });   
        res.status(200).json({ message: 'Products updated', cart: updatedCart });
    }
    catch (error){
        logger.error('Error updating all products in cart', { cartId: cid, error: error.message });
        CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);        
    }
}

const getPurchase= async(req, res)=>{
    const {cid} = req.body;
   
    const response = await cartService.purchase(cid,req.cookies.token);
    logger.info('Purchase request processed', { cartId: cid });
    res.json({data: response});
}


export const cartController={
    "addCart":addCart,
    "getById":getById,
    "addProductToCart":addProductToCart,
    "deleteProduct":deleteProduct,
    "deleteAllProducts":deleteAllProducts,
    "updateProductToCart":updateProductToCart,
    "updateAllProducts":updateAllProducts,
    "getPurchase":getPurchase
}
