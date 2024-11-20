import { Router } from "express";
import { logoutUser, registerUser, userLogin } from "../Controllers/user.controllers.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(userLogin);
router.route("/logout").post(logoutUser);


export default router