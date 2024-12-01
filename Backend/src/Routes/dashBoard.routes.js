import { Router } from "express";
import { verifyJWT } from "../Middleware/auth.middleware.js";
import { getDashBoardDetails } from "../Controllers/dashBoard.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/stats").get(getDashBoardDetails);

export default router;

