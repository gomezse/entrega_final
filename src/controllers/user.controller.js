import { usersManager } from '../dao/models/mongoose/UsersManager.js';
import {userService} from '../services/user.service.js';
import mongoose from "mongoose";
import crypto from 'crypto-browserify';
import { ResetToken } from '../models/mongoose/resetToken.model.js';
import {transporter} from "../utils/nodemailer.js";
import config from "../utils/config.js";
import CustomError from '../errors/error.generator.js';
import { ErrorsMessages,ErrorsName } from '../errors/error.enum.js';

const getAll= async(req,res)=>{
  const {limit}=req.query;
  const info = await userService.getAll(limit);
    try{
        if (!info) {
            return res.status(200).json({ message: 'No users' });
        }
        res.status(200).json({ message: 'Users found', info });
    } catch (error) {
      // console.log(error);
        CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);        
    }
}

const getUser = async (req, res) => {
  res.json({
    message: "User founded successfully",
    user: await userService.getUser(req),
  });
};

const create =async (req, res) => {
  const user = req.body;
  const createdUser = await userService.create(user);
  res.json({ createdUser });
}
const deleteUser =async (req, res) => {
  const {uid} = req.body;
  if (!mongoose.Types.ObjectId.isValid(uid)) {
    return res.status(400).json({ message: "Invalid ObjectId" });
  }

  const objectId =new  mongoose.Types.ObjectId(uid);

  const user = await userService.findById(uid)
  const deletedUser= await userService.delete(objectId,user);

  if (!deletedUser){ res.status(400).json({ message:"User not deleted"});}

  res.status(200).json({ deletedUser });
}

const sendmail= async(req,res)=>{
  const { email } = req.body;

  const user = await userService.findByEmail(email);


  if (!user) {
    return res.status(404).send('Usuario no encontrado');
  }

  const token = crypto.randomBytes(32).toString('hex');

  const resetToken = await ResetToken.create({ user: user._id, token });
  
  user.resetToken=resetToken;

  user.save();


  const resetUrl = `* https://entregafinal-production-7f74.up.railway.app/restaurar`;
  const mailOptions = {
    from: config.mail_reestablecer,
    // to: email,
    to: config.mail_reestablecer,
    subject: 'Restablecer Contraseña',
    html: `<p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña.</p>`,
  };

  await transporter.sendMail(mailOptions);
  res.json({message:'Correo de restablecimiento enviado.'});
}



const premium= async (req,res)=>{

const user = await usersManager.findById(req.params.uid);
const ROLES_ADMITIDOS =["PREMIUM","USER"];
if(!user){
  return res.status(400).json({message:"User not found"});
}
//si role user no tiene documentos cargados no deja hacer el pase.
if( user.role === 'USER'){
  const control = ["profiles", "products", "documents"];
  const nombresEncontrados = user.documents.map(doc => doc.name);
  if(!nombresEncontrados){
    return res.status(404).send('No posee documentos cargados.');
  }
  for (const nombre of control) {
    if (!nombresEncontrados.includes(nombre)) {
      // throw new Error(`Falta cargar el documento con nombre  "${nombre}".`);
      return res.status(404).send(`Falta cargar el documento con nombre  "${nombre}".`);
    }
  }
}

if(ROLES_ADMITIDOS.includes(user.role)){
  user.role = ROLES_ADMITIDOS.filter(rol => rol !== user.role)[0];
  await user.save();
  return res.status(200).json({message:"Role updated",usuario:user});
}

return res.status(400).json({message:"Role cannot be modified",usuario:user});
}
export const saveUserDocuments = async (req, res) => {
  const { id } = req.params;
  const { profiles,products,documents} = req.files;
  const response = await userService.saveUserDocuments({ id, profiles, products, documents });
  res.json({ response });
};


export const deleteInactiveUsers = async (req, res) => {
 
  const response = await userService.deleteInactiveUsers();
  if(!response) return res.status(400).json({message:"No existen usuarios para eliminar"});
  return res.status(200).json({message:"ok"});
}

export const updateUser = async (req, res) => {
  const{email,role}=req.body;
  const user = await userService.findByEmail(email);
  if(!user)return res.status(400).json({message:"User not found"});
  user.role = role;
  await user.save();

  return res.status(200).redirect("/users");
}
export const userController = {
  "getAll":getAll,
  "getUser": getUser,
  "create":create,
  "sendmail":sendmail,
  "premium":premium,
  "saveUserDocuments":saveUserDocuments,
  "delete":deleteUser,
  "deleteInactiveUsers":deleteInactiveUsers,
  "updateUser":updateUser
};
