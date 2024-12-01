import { Router } from "express";
import { addComment, deleteComment, getSnippetComment, updateComment } from "../Controllers/comment.controllers.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";

const router = Router();

router.route("/s/:snippetId").get(getSnippetComment);

router.use(verifyJWT);

router.route("/s/:snippetId").post(addComment);

router.route("/:commentId").put(updateComment);

router.route("/:commentId").delete(deleteComment);

export default router;