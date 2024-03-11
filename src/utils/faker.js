import {fakerES_MX as faker} from '@faker-js/faker';
import {v4 as uuidv4} from 'uuid'



export const generateProduct =() =>{
    const product ={
        id:faker.database.mongodbObjectId(),
        title:faker.commerce.product(),
        price:faker.commerce.price({ min: 10, max: 400000 }) ,
        stock: faker.number.int(100),
        status:true,
        description:faker.commerce.productDescription(),
        code:uuidv4(),
        thumbnails:faker.image.avatar(),
        category:faker.commerce.productAdjective() 
    }
    return product;
}