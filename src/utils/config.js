import dotenv from 'dotenv'
import { program } from './process.js';

const {mode}= program.opts();
console.log('modo de entorno: ',mode);
dotenv.config({
    
    path:mode==='test'?'.env.testing'
    :mode==='production'?'.env.production'
    :'.env.development'
});

export default{
    "port":process.env.PORT,
    "mongoUrl":process.env.MONGO_URL,
    "adminName":process.env.ADMIN_NAME,
    "adminPassword":process.env.ADMIN_PASSWORD,
    "gitClientId":process.env.GIT_CLIENT_ID,
    "gitClientSecret":process.env.GIT_CLIENT_SECRET,
    "googleClientId":process.env.GOOGLE_CLIENT_ID,
    "googleClientSecret":process.env.GOOGLE_CLIENT_SECRET,
    "secretKeyJWT":process.env.SECRET_KEY_JWT,
    "nodemailerUser":process.env.NODEMAILER_USER,
    "nodemailerPassword":process.env.NODEMAILER_PASSWORD,
    "rolUser":process.env.ROLE_USER,
    "environment":process.env.ENVIRONMENT,
    "mail_reestablecer":process.env.MAIL_PARA_REESTABLECER
}