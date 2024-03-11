import { dirname,join } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "./config.js";


export const __dirname = join(dirname(fileURLToPath(import.meta.url)),"../");

export const hashData = async (data) => {
    return bcrypt.hash(data, 10);
  };
  
  export const compareData = async (data, hashedData) => {
    return bcrypt.compare(data, hashedData);
  };
  
  export const generateToken = (user) => {
    const token = jwt.sign(user, config.secretKeyJWT, { expiresIn: 15000 });
    console.log("token generado: ", token);
    return token;
  };