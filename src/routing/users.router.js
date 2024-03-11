import {Router} from 'express';
import { userController } from '../controllers/user.controller.js';
import { jwtValidation } from '../middlewares/jwt.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
const router =new Router();

router.get('/:idUser',jwtValidation,authMiddleware(["ADMIN"]),
    userController.getUser);

router.post("/",userController.create);    
router.post("/sendmail",userController.sendmail);
router.get("/premium/:uid",userController.premium);
router.post("/:id/documents",upload.fields([
      { name: "profiles", maxCount: 1 },
      { name: "products", maxCount: 1 },
      { name: "documents", maxCount: 1 },
    ]),
    userController.saveUserDocuments
  );
  
export default router;