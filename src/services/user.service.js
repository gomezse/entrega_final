import { usersManager } from "../dao/models/mongoose/UsersManager.js";
import { cartsManager } from "../dao/models/mongoose/CartsManager.js";
import {transporter} from "../utils/nodemailer.js";
import UsersRequestDto from "../dtos/users-request.dto.js";
import UsersResponseDto from "../dtos/users-response.dto.js";
import UsersResponseListDto from "../dtos/user-response-list.dto.js";
import moment from 'moment-timezone';
import {hashData} from "../utils/utils.js";

class UserService {
  async getUser(req) {
    const { idUser } = req.params;    
      const user = await usersManager.findById(idUser); 
      const userDto= new UsersResponseDto(user);     
      return userDto;    
  }

  async getAll(limit){
    const users = await usersManager.findAll(limit);
    if(!users){return {}}
    const usersDto = users.map(user => new UsersResponseListDto(user)); 
    return usersDto;

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

  async delete(id,user){
    this.sendMailDelete( `<p>Su usuario <b>${user.first_name}</b>  ha sido <b>ELIMINADO</b> .</p>`,user.email)
    return usersManager.deleteOne(id);
  }

  async findByEmail(email){
     
      const user = await usersManager.findByEmail(email); 
    
      return user;    
  }
  
  async findById(id){
     
    const user = await usersManager.findById(id); 
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

  async deleteInactiveUsers(){
     
    const userList = await usersManager.findAll();
    const current = moment.tz('America/Argentina/Buenos_Aires');
    current.subtract(2, 'days');
    const currentDate = new Date(current);

    const filterUserList = userList.filter(user => {
      const last_connectionDate= this.convertStringToDate(user.last_connection);
      return moment(last_connectionDate).isBefore(currentDate);
    })

    if (!filterUserList || filterUserList.length==0) return false;

    filterUserList.forEach(user => {
       usersManager.deleteOne(user._id);
       this.sendMailDelete( `<p>Su usuario <b>${user.first_name}</b>  ha sido <b>ELIMINADO</b> por tener una inactividad superior a 2 días en el ecommerce.</p>`,user.email)
    })

    return true;    
}

convertStringToDate(fechaStr){
  const partes = fechaStr.split(/, | de /);
  const anio = parseInt(partes[3]);
  const mes = partes[2];
  const dia = parseInt(partes[1]);
  const [hora, minuto, segundo] = partes[4].split(':').map(str => parseInt(str));

  const fecha = new Date(anio, this.obtenerNumeroMes(mes), dia, hora, minuto, segundo);
  return fecha;

}

 obtenerNumeroMes(nombreMes) {
    const meses = {
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
        'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };
    return meses[nombreMes.toLowerCase()];
}

  async sendMailDelete(msj,email){
 
  const mailOptions = {
    from: 'gomezsebastian909@gmail.com',
    // to: email,
    to: 'gomezsebastian909@gmail.com',
    subject: 'Usuario eliminado',
    html:msj,
  };

  await transporter.sendMail(mailOptions);
}

}

export const userService = new UserService();
