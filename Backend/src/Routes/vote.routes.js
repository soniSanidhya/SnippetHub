import { Router } from "express";
import { getDownVoteCount, getUpVoteCount, isVoted, toggleCommentLike, toggleSnippetVote } from "../Controllers/vote.controllers.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";

const router = Router();

router.route("/upVotes/:id").get(getUpVoteCount);

router.route("/downVotes/:id").get(getDownVoteCount);

router.use(verifyJWT);

router.route("/s/:snippetId").post(toggleSnippetVote);

router.route("/c/:commentId").post(toggleCommentLike);

router.route("/isVoted/:id").get(isVoted);




export default router;
