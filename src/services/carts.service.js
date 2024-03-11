import { cartsManager } from "../dao/models/mongoose/CartsManager.js";
import { ticketsManager } from "../dao/models/mongoose/TicketsManager.js";
import config from "../utils/config.js";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from 'uuid';
import {logger} from "../utils/logger.js";

class CartService{

   async addProductToCart(idCart,idProduct){
        const response = await cartsManager.addProductToCart(idCart,idProduct);        
        return response;
    }

    async getCart(id){
        const cart= await cartsManager.getCartById(id);
        return cart;
    }

    async purchase(cid,token){
        
        const cart = await cartsManager.getCartById(cid);
        const products= cart.products;
        let availableProducts= [];
        let unavailableProducts= [];
        let totalAmount= 0;

        for(let item of products){
           if(item.product.stock >= item.quantity){
                availableProducts.push(item);
                item.product.stock -= item.quantity;                
                await item.product.save();
                totalAmount += item.quantity * item.product.price;
           }else{
                unavailableProducts.push(item);
           }           
        }

        cart.products = unavailableProducts;
        await cart.save();
        const user = jwt.verify(token, config.secretKeyJWT);

        if(availableProducts.length){
            const ticket = {
                code:uuidv4(),
                purchase_datetime:new Date(),
                amount:totalAmount,
                purchaser: user.email?user.email:"nohaycorreo@gmail.com"
    
            }
            await ticketsManager.createTicket(ticket);
            return {products:availableProducts,amount:totalAmount}
        }
        return {products:unavailableProducts,amount:"No definido"};
    }
}
export const cartService = new CartService();