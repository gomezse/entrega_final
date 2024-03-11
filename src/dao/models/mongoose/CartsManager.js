import { cartsModel } from '../../../models/mongoose/cart.model.js'


class CartsManager {
    /**
     * Busca y devuelve un carrito por su ID.
     * @param {string} searchId - El ID del carrito a buscar.
     * @returns {Promise<Object|null>} - El carrito encontrado o null si no se encuentra.
     */
    async getCartById(searchId) {
        try {
            const cart = await cartsModel.findById(searchId).populate('products.product',['title','description','price','stock','thumbnails','category','code']);
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Obtiene y devuelve todos los carritos.
     * @returns {Promise<Array>} - Una matriz de carritos.
     */
    async getCarts() {
        try {
            const carts = await cartsModel.find();
            return carts;
        } catch (error) {
            return error;
        }
    }

    /**
     * Crea un nuevo carrito vacío.
     * @returns {Promise<Object>} - El carrito recién creado.
     */
    async createCart() {
        try {
            const newCart = { products: [] };
            const response = await cartsModel.create(newCart);
            return response;
        } catch (error) {
            return error;
        }
    }

    /**
     * Agrega un producto a un carrito especificado.
     * @param {string} cartId - El ID del carrito al que se debe agregar el producto.
     * @param {string} productId - El ID del producto a agregar.
     * @returns {Promise<Object>} - El carrito actualizado con el producto agregado.
     */
    async addProductToCart(cartId, productId) {
        try {
            const cart = await cartsModel.findById(cartId);

            const productIndex = cart.products.findIndex(
                (p) => p.product._id.equals(productId)
            );
            if (productIndex === -1) {
                cart.products.push({ product: productId, quantity: 1 });
            } else {
                cart.products[productIndex].quantity++;
            }
            return cart.save();
        } catch (error) {
            return error;
        }
    }

    async removeProductToCart(cartId, productId) {
        try {
            const cart = await cartsModel.findById(cartId);

            const productIndex = cart.products.findIndex(
                (p) => p.product._id.equals(productId)
            );
            if (productIndex === -1) {
                return new Error('Product not found into cart');
            }
            //caso de que tenga cantidad de product mayor a 1, disminuimos su cantidad
            if (cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity--;
                await cart.save();
            } else {
                cart.products.splice(productIndex, 1);
                await cart.save();
            }
            return cart;

        } catch (error) {
            return error;
        }
    }

    async updateQuantityProduct(cartId,productId,quantity) {       
        try {
            
            const cart = await cartsModel.findById(cartId).populate('products.product');

            const productIndex = cart.products.findIndex(
                (p) => p.product._id.equals(productId)
            );

            if (productIndex === -1) {
                return new Error('Product not found into cart');
            }
                   
            cart.products[productIndex].quantity=quantity;            

            return await cart.save();
        } catch (error) {
            return error;
        }
    }


    async removeAllProductsToCart(cartId) {
        try {
            const cart = await cartsModel.findById(cartId);

           if(cart.products){
                cart.products=[];
           }else{
                return new Error('Products not found in cart');
           }
            return await cart.save();

        } catch (error) {
            return error;
        }
    }

    async updateAllProducts(cartId,products){
        try {
            const cart = await cartsModel.findById(cartId);
            if(!cart){
                return new Error('Cart not found');
            }
            cart.products=products;
            return await cart.save();

        } catch (error) {
            return error;
        }
        
    }


}

export const cartsManager = new CartsManager();
