import mongoose from "mongoose";
import { Vote } from "../Models/vote.model.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";


const toggleSnippetVote = asyncHandler(async (req, res) => {
  const { snippetId } = req.params;
  let { isUpVote = false } = req.body;
  isUpVote = isUpVote === true || isUpVote === "true";
  //TODO: toggle like on video

  // console.log("entered toggle like" , isLiked);

  if (!snippetId) {
    throw new ApiError(400, "Video id is missing");
  }
  // isLiked = isLiked === "true" ? true : false;

  // console.log("isLiked: ", isLiked);

  const votePrev = await Vote.find({
    snippet: snippetId,
    votedBy: req.user._id,
  });

  let flag = false;
  let vote = {};
  if (votePrev?.length > 0 && !(votePrev[0].isUpVote ^ isUpVote)) {
    flag = true;

    await Vote.findByIdAndDelete(votePrev[0]._id);
  } else if (votePrev?.length > 0 && votePrev[0].isUpVote ^ isUpVote) {
    flag = false;

    vote = await Vote.findByIdAndUpdate(
      votePrev[0]._id,
      {
        isUpVote,
      },
      {
        new: true,
      }
    );
  } else {
    flag = false;

    vote = await Vote.create({
      snippet: snippetId,
      votedBy: req.user._id,
      isUpVote,
    });
  }

  if (!vote) {
    throw new ApiError(
      500,
      flag
        ? "Something went wrong while disliking  video"
        : "Something went wrong while liking  video"
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        vote,
        flag
          ? isUpVote
            ? "Video unliked successfully"
            : "Video liked successfully"
          : "Video liked / disliked successfully"
      )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  if (!commentId) {
    throw new ApiError(400, "Comment id is missing");
  }

  const votePrev = await Vote.find({
    comment: commentId,
    likedBy: req.user._id,
  });
  let flag = false;
  let like;
  if (votePrev.length > 0) {
    flag = true;
    like = await Vote.findByIdAndDelete(votePrev[0]._id);
    // console.log("Vote deleted");
  } else {
    // console.log("Vote created");
    flag = false;
    like = await Vote.create({
      comment: commentId,
      likedBy: req.user._id,
    });
  }

  if (!like) {
    throw new ApiError(
      500,
      flag
        ? "Something went wrong while disliking comment"
        : "Something went wrong while liking  comment"
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        like,
        flag ? "Comment disliked successfully" : "Comment liked successfully"
      )
    );
});

const getUpVoteCount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Id is missing");
  }
  const voteCount = await Vote.aggregate([
    {
      $match: {
        $or: [
          { snippet: new mongoose.Types.ObjectId(id) },
          { comment: new mongoose.Types.ObjectId(id) },
        ],
        isUpVote: true,
      },
    },
    {
      $count: "voteCount",
    },
    {
      $project: {
        voteCount: 1,
      },
    },
  ]);
  // console.log(likeCount);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        voteCount[0] || { voteCount: 0 },
        "Vote count fetched successfully"
      )
    );
});

const getDownVoteCount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Id is missing");
  }
  const downVoteCount = await Vote.aggregate([
    {
      $match: {
        $or: [
          { snippet: new mongoose.Types.ObjectId(id) },
          { comment: new mongoose.Types.ObjectId(id) },
        ],
        isUpVote: false,
      },
    },
    {
      $count: "downVoteCount",
    },
    {
      $project: {
        downVoteCount: 1,
      },
    },
  ]);
  // console.log(disLikeCount);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        downVoteCount[0] || { downVoteCount: 0 },
        "Down Vote count fetched successfully"
      )
    );
});

const isVoted = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Id is missing");
  }
  const vote = await Vote.findOne({
    $or: [
      { snippet: new mongoose.Types.ObjectId(id) },
      { comment: new mongoose.Types.ObjectId(id) },
    ],
    votedBy: req.user._id,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        vote || { isVoted: false },
        "Vote fetched successfully"
      )
    );
})

export {
  toggleCommentLike,
  toggleSnippetVote,
  getUpVoteCount,
  getDownVoteCount,
  isVoted,
};
