import {Router} from 'express';
import {transporter} from "../utils/nodemailer.js";
const router = Router();

router.get("/",async (req,res)=>{

    const mailOptions = {
        from: "Sebastian",
        to: ["gomezsebastian909@gmail.com"],
        subject: "Enviado msj desde app ",
        html: `<h1>Mejor ponte a trabajar</h1>
        <img src="https://cdn.memegenerator.es/imagenes/memes/full/30/27/30270635.jpg" alt="Ponete a laburar loca">`,
        attachments:[{path:"https://cdn.memegenerator.es/imagenes/memes/full/30/27/30270635.jpg"}]
    };
    await transporter.sendMail(mailOptions);
    res.send("Email enviado!");
});

router.post("/",async (req,res)=>{
    const {first_name,last_name,email,message}=req.body;
    const mailOptions = {
        from: "Sebastian",
        to: [email],
        subject: `${first_name} ${last_name}`,
        text:message,             
    };
        
    await transporter.sendMail(mailOptions);
    res.send("Email enviado!");
});
export default router;