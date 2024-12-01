import { Router } from "express";
import {
  getCurrentUser,
  getMySnippets,
  getUserChannelProfile,
  logoutUser,
  registerUser,
  updateAccountDetails,
  updateAvatar,
  userLogin,
} from "../Controllers/user.controllers.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(userLogin);
router.route("/profile/:username").get(getUserChannelProfile);

router.route("/update/avatar").patch(upload.single("avatar"), verifyJWT, updateAvatar);
router.use(verifyJWT);

router.route("/getSnippets").get(getMySnippets);
router.route("/").get(getCurrentUser);
router.route("/update").patch(updateAccountDetails);
router.route("/logout").post(logoutUser);

export default router;
