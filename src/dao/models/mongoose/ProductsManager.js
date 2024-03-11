import { productsModel } from '../../../models/mongoose/product.model.js'

class ProductsManager {
    //---------------- FUNCIONES AUXILIARES -------------------------------------

    /**
     * Valida si todos los campos obligatorios del producto están presentes.
     * @param {Object} p - El objeto del producto a validar.
     * @returns {boolean} - Devuelve true si todos los campos obligatorios están presentes, caso contrario false.
     */
    validate = (p) => p.title && p.description && p.price && p.code && p.stock;

    /**
     * Comprueba si ya existe un producto con el código especificado.
     * @param {string} code - El código del producto a verificar.
     * @returns {boolean} - Devuelve true si se encuentra un producto con el mismo código, caso contrario false.
     */


    // ------------------------------------ FUNCIONES CRUD ------------------------

    /**
     * Encuentra y devuelve todos los productos, opcionalmente limitados a una cantidad máxima.
     * @param {number} limit - Límite de la cantidad de productos a devolver (opcional).
     * @returns {Promise<Array>} - Devuelve una matriz de productos.
     */
    // async findAll(limit = 0) {
    //     try {
    //         const products = await productsModel.find().limit(limit).lean();
    //         return products;
    //     } catch (error) {
    //         return error;
    //     }
    // }


    async findAll(obj) {
        try {
            //desestructurando variables del objeto.
            const { limit = 10, page = 1, sort = 1, ...query } = obj;
            
            //defino tipo de sort a realizar.
            const sortOption = sort === '1' ? 'price' : '-price';

            const options = {
                limit,
                page,
                sort: sortOption, 
            };

            const response = await productsModel.paginate(query, options);

            const info = {
                status: response.status,
                payload: response.docs,
                totalPages: response.totalPages,
                prevLink: response.hasPrevPage ? `/products?page=${response.prevPage}&limit=${limit}&sort=${sort}` : null,
                nextLink: response.hasNextPage ? `products?page=${response.nextPage}&limit=${limit}&sort=${sort}` : null,
                page: response.page,
                hasNextPage: response.hasNextPage,
                hasPrevPage: response.hasPrevPage
            }

            return info;
        } catch (error) {
            return error;
        }
    }


    /**
     * Encuentra un producto por su ID.
     * @param {string} id - El ID del producto a buscar.
     * @returns {Promise<Object|null>} - Devuelve el producto encontrado o null si no se encuentra.
     */
    async findById(id) {
        try {
            const product = await productsModel.findById(id);
            return product;
        } catch (error) {
            return error;
        }
    }

    /**
     * Crea un nuevo producto en la base de datos.
     * @param {Object} product - El objeto del producto a crear.
     * @returns {Promise<Object>} - Devuelve el producto creado.
     */
    async createOne(product) {
        try {
            if (!this.validate(product)) {
                return console.error('Debe llenar todos los campos, son obligatorios.');
            }

            const newProduct = await productsModel.create(product);

            return newProduct;
        } catch (error) {
            return error;
        }
    }

    /**
     * Actualiza un producto existente por su ID.
     * @param {string} id - El ID del producto a actualizar.
     * @param {Object} product - El objeto del producto con los cambios.
     * @returns {Promise<Object>} - Devuelve el producto actualizado.
     */
    async updateOne(id, product) {
        try {
            const updatedProduct = await productsModel.updateOne({ _id: id }, product);
            return updatedProduct;
        } catch (error) {
            return error;
        }
    }

    /**
     * Elimina un producto por su ID.
     * @param {string} id - El ID del producto a eliminar.
     * @returns {Promise<Object>} - Devuelve el resultado de la operación de eliminación.
     */
    async deleteOne(id) {
        try {
            const deletedProduct = await productsModel.deleteOne({ _id: id });
            return deletedProduct;
        } catch (error) {
            return error;
        }
    }

    async findOne(){
        try {
            const product = await productsModel.findOne({});
            return product;
        } catch (error) {
            return error;
        }
    }
}

export const productsManager = new ProductsManager();
