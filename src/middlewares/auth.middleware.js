import config from "../utils/config.js";
import jwt from "jsonwebtoken";

export const authMiddleware = (roles) => {     
  return (req, res, next) => {    
  
  const user = jwt.verify(req.cookies.token, config.secretKeyJWT);
    
  if (!user){
    return res.status(401).json({message:"Unauthorized"});
  }  
  req.user = user; 
  if(roles && !roles.includes(user.role)) {
    return res.status(403).json({message:"Forbidden"});
  }

  next();    
}
};