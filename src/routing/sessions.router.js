import { Router } from "express";
import {sessionController } from "../controllers/session.controller.js";
import passport from "passport";
const router = Router();

router.post("/signup", sessionController.signup);
router.post("/login",sessionController.login);
router.get("/auth/github",sessionController.authGit);
router.get("/callback", sessionController.callback);
router.get("/auth/google",sessionController.authGoogle);
router.get("/auth/google/callback",sessionController.callbackGoogle);
router.get("/signout",sessionController.signout);
router.get("/current",sessionController.current);
router.post("/restaurar",sessionController.restaurar);

export default router;




