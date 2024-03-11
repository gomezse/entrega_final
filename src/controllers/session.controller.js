
import { hashData, compareData, generateToken } from "../utils/utils.js";
import { usersManager } from "../dao/models/mongoose/UsersManager.js";
import passport from "passport";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import CustomError from '../errors/error.generator.js';
import { ErrorsMessages,ErrorsName } from '../errors/error.enum.js';
import { cartsManager } from "../dao/models/mongoose/CartsManager.js";
import config from "../utils/config.js";
import { ResetToken } from "../models/mongoose/resetToken.model.js";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  const { first_name, last_name, email, password ,role} = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "Los campos son obligatorios" });
  }
  try {
    const hashedPassword = await hashData(password);
    const cart = await cartsManager.createCart();
    const createdUser = await usersManager.createOne({
      ...req.body,
      password: hashedPassword,
      role:role?role:config.rolUser,
      cart:cart._id
    });

    
    // res.status(200).json({ message: "Usuario creado", user: createdUser });
    res.status(200).redirect("/login");
  } catch (error) {
    CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);      
  }
}







const login = async (req, res) => {
  const { email, password } = req.body;
  // console.log('REQ BODY',req.body);
  if (!email || !password) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }
  try {
    const user = await usersManager.findByEmail(email);
    if (!user) {
      return res.redirect("/signup");
    }    
    const isPasswordValid = await compareData(password, user.password);
    if (!isPasswordValid) {
      CustomError.generateErrorMessage(ErrorsMessages.INVALID_PASSWORD,401,ErrorsName.INVALID_PASSWORD);   
    }
  
    //jwt
    const { first_name, last_name, role ,cart} = user;
    const token = generateToken({ first_name, last_name, email, role ,cart});
    
    const opciones = { timeZone: 'America/Argentina/Buenos_Aires', hour12: true, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const dateActual = new Date().toLocaleString('es-AR', opciones);


    user.last_connection = dateActual;
    await user.save()
    
    res.cookie("token", token, { maxAge: 3600000 })
    .redirect("/profile");
  } catch (error) {
    res.status(500).json({ error });
  }
}
const callback = passport.authenticate("github", {
  successRedirect: "/profile", 
  failureRedirect: "/error" 
});
const authGit = passport.authenticate("github", { scope: ["user:email"] });

const authGoogle = passport.authenticate("google", { scope: ["profile", "email"] });

const callbackGoogle= passport.authenticate("google", {
  successRedirect: "/profile", 
  failureRedirect: "/error" 
});

const signout = async (req, res) => {

  // req.session.destroy(() => {
  //   res.redirect("/login");
  // });
  const userToken = jwt.verify(req.cookies.token, config.secretKeyJWT);
  const user = await usersManager.findByEmail(userToken.email);
  const opciones = { timeZone: 'America/Argentina/Buenos_Aires', hour12: true, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const dateActual = new Date().toLocaleString('es-AR', opciones);

  user.last_connection = dateActual;
  await user.save()

//con cookies
  res.clearCookie('token'); 
  res.redirect("/login");
}

const current = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err,jwt_payload) => {
    if (err) {      
      CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);  
      
    }

    if (!jwt_payload) {      
      CustomError.generateErrorMessage(ErrorsMessages.ErrorsName.INVALID_CREDENTIALS,401,ErrorsName.INVALID_CREDENTIALS);      
    }

    req.user = jwt_payload;    
    // authMiddleware(["ADMIN"])(req, res, async () => {
    authMiddleware(["ADMIN","PUBLIC"])(req, res, async () => {
      try {

        res.json({ message: req.user });
      } catch (error) {
        CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);      
      }
    });
  })(req, res, next);
};


const restaurar =  async (req, res) => {
  const { email, password } = req.body;
  try {
   
    const user = await usersManager.findByEmail(email);
    
    if (!user) {
      return res.redirect("/");
    }

    const resetToken = await ResetToken.findById(user.resetToken._id);
    
    if (!resetToken || !resetToken.user) {
      return res.status(404).send('Token no válido');
    }
  
    
     // Verificar si el token ha expirado
    if (resetToken.createdAt < Date.now()) {    
      return res.redirect('/profile');
    }

    const isPasswordValid = await compareData(password, user.password)
 
    if(!isPasswordValid) {      
      const hashedPassword = await hashData(password);
      user.password = hashedPassword
      user.save();
      res.json({message:"Contraseña reestablecida con éxito."});
    }else{
      res.json({message:"No puede poner la misma clave que tenia."});
    }
    
   
  } catch (error) {
    console.log('error',error);
    CustomError.generateErrorMessage(ErrorsMessages.ERROR_INTERNAL,500,ErrorsName.ERROR_INTERNAL);   
  }
}


export const  sessionController ={
    "signup":signup,
    "login":login,
    "authGit":authGit,
    "callback":callback,
    "authGoogle":authGoogle,
    "callbackGoogle":callbackGoogle,
    "signout":signout,
    "current":current,
    "restaurar":restaurar
};




