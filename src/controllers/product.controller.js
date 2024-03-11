import { productsManager } from '../dao/models/mongoose/ProductsManager.js';
import { generateProduct } from '../utils/faker.js';
import CustomError from '../errors/error.generator.js';
import { ErrorsMessages,ErrorsName } from '../errors/error.enum.js';
import config from "../utils/config.js";
import jwt from "jsonwebtoken";

const getAll = async (req, res) => {
    try {
        const info = await productsManager.findAll(req.query);

        if (!info.payload.length) {
            return res.status(200).json({ message: 'No products' });
        }

        res.status(200).json({ message: 'Products found', info });
    } catch (error) {
        CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);        
    }
}

const getById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productsManager.findById(pid);
        if (!product) {
            CustomError.generateErrorMessage(ErrorsMessages.PRODUCT_NOT_FOUND,404,ErrorsName.PRODUCT_NOT_FOUND);        
        }
        res.status(200).json({ message: 'Product found', product });

    } catch (error) {
        CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);        
    }
}


const addProduct= async (req, res) => {
    const { title, description, code, price, stock, category} = req.body;
    
    
    // const user = jwt.verify(req.cookies.token, config.secretKeyJWT);

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: `Required data is missing` });
    }

   

    try {
        if(req.body.id){
            const product = await productsManager.findById(req.body.id);
            

            if(product){
                const updatedProduct= productsManager.updateOne(product._id,{...req.body,owner:'admin'})
                res.status(200).json({ message: 'Product updated', product: updatedProduct });
            }
        }
        
        delete req.body.id;
        const newProduct = await productsManager.createOne({...req.body,owner:'admin'});   
        // console.log('new product',newProduct);     
        if (newProduct.code === 11000) {

            CustomError.generateErrorMessage(ErrorsMessages.PRODUCT_ALREADY_EXISTS,400,ErrorsName.PRODUCT_ALREADY_EXISTS);        
        }
        res.status(200).json({ message: 'Product created', product: newProduct });

    } catch (error) {
        res.status(500).json({ message: 'Product not created' });
        // CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);        
    }
}


const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const deletedProduct = await productsManager.deleteOne(pid)
        res.status(200).json({ message: 'Product deleted', deletedProduct });
    } catch (error) {
        CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);        
    }
};

const updateProduct =  async (req, res) => {
    const { pid } = req.params;

    try {
        if(!req.body){res.status(400).json({ message: 'No attributes to update', product: {} });}
        
        const updateResult = await productsManager.updateOne({ _id: pid }, req.body);

        if (updateResult.matchedCount === 1) {
            const updatedProduct = await productsManager.findById(pid);
            // Devuelve el producto actualizado en la respuesta
            res.status(200).json({ message: 'Product updated', product: updatedProduct });
        } else {
            // En caso de que no se encuentre el producto para actualizar
            CustomError.generateErrorMessage(ErrorsMessages.PRODUCT_NOT_FOUND,404,ErrorsName.PRODUCT_NOT_FOUND);        
        }
    } catch (error) {                
        res.status(500).json({ message: 'Product not updated', product: {} });        
        // CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);        
    }
}

const getMockingProducts =  async (req, res) => {
        let arrayProducts = [];
        
        for(let i=0 ;i<100;i++){
            const product=generateProduct();
            arrayProducts.push(product);    
        }
        
        res.status(200).json({ message: 'Mocked Products', arrayProducts });
} 

export const productController ={
    "getAll":getAll,
    "getById":getById,
    "addProduct":addProduct,
    "deleteProduct":deleteProduct,
    "updateProduct":updateProduct,
    "getMockingProducts":getMockingProducts
}