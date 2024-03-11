import { usersManager } from "../dao/models/mongoose/UsersManager.js";
import { cartsManager } from "../dao/models/mongoose/CartsManager.js";

import UsersRequestDto from "../dtos/users-request.dto.js";
import UsersResponseDto from "../dtos/users-response.dto.js";

import {hashData} from "../utils/utils.js";

class UserService {
  async getUser(req) {
    const { idUser } = req.params;    
      const user = await usersManager.findById(idUser); 
      const userDto= new UsersResponseDto(user);     
      return userDto;    
  }

  async getAll(){
    return usersManager.getAll();
  }

  async create(user){
    const cart = await cartsManager.createCart();
    const hashPassword= await hashData(user.password);
 
    const userDto= new UsersRequestDto({...user,
      cart:cart._id,
      password:hashPassword});

    const createdUser= await usersManager.createOne(userDto);
    return createdUser;
  }

  async delete(id){
    return usersManager.deleteOne(id);
  }

  async findByEmail(email){
     
      const user = await usersManager.findByEmail(email); 
    
      return user;    
  }

  async saveUserDocuments({ id, profiles, products, documents }) {
    const savedDocuments = await usersManager.updateOne(id, {
      documents: [
        {
          name: "profiles",
          reference: profiles[0].path,
        },
        {
          name: "products",
          reference: products[0].path,
        },
        {
          name: "documents",
          reference: documents[0].path,
        },
      ],
    });
    return savedDocuments;
  };

}

export const userService = new UserService();
