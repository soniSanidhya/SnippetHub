import { Router } from "express";
import {
  addFollower,
  getFollowers,
  getFollowing,
  isFollowing,
  removeFollower,
} from "../Controllers/follow.controllers.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";

const router = Router();

router.route("/:userId").get(getFollowers);

router.route("/following/:userId").get(getFollowing);

router.use(verifyJWT);

router.route("/:userId").post(addFollower);

router.route("/isFollowing/:userId").post(isFollowing);

router.route("/un/:userId").post(removeFollower);

export default router;