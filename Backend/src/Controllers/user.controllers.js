import fs, { watch } from "fs";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/apiError.js";
import { User } from "../Models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../Utils/cloudinary.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
// import { Vote } from "../Models/vote.model.js";
// import { Video } from "../Models/video.model.js";
// import { subscribe } from "diagnostics_channel";
import { Snippet } from "../Models/snippet.model.js";

const generateRefreshTokenAndAcessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;

    user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token and refresh token "
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { username, password, email } = req.body;

  console.log(req.body);

  if (
    [ username, email, password].some((el) => el?.trim() === "") ||
    [ username, email, password].some((el) => el?.trim() === undefined)
  ) {
    throw new ApiError(400, "All feilds are required");
  }
  // console.log("received");

  const userExist = await User.findOne({
    $or: [{ username }, { email }],
  });


  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
  });

  // console.log("sent to database");

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while regidtering user");
  }

  return res.json(
    new ApiResponse(200, createdUser, "user Succesfully Registered")
  );
});

const userLogin = asyncHandler(async (req, res) => {
  // const { username, password, email } = req.body;
  const { fullName, username, password, email } = req.body;

  // console.log(req.body);

  if (!(username || email)) {
    throw new ApiError(400, "Email or username is required");
  }

  const user = await User.findOne({
    $or: [{ username: username || email }, { email: email || username }],
  });

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { refreshToken, accessToken } = await generateRefreshTokenAndAcessToken(
    user._id
  );

  const LoggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: LoggedInUser,
          refreshToken,
          accessToken,
        },
        "Succesfully Logged in"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // console.log("user", req.user);

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorised request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(401, "Invalid Refresh Token");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "RefreshToken is expired or already used");
  }

  const { accessToken, newRefreshToken } = generateRefreshTokenAndAcessToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("refreshToken", newRefreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken: newRefreshToken,
        },
        "Acess Token Refreshed"
      )
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "all feilds are required");
  }
  // // console.log(oldPassword);
  // // console.log(newPassword);

  const user = await User.findById(req.user?._id);
  // // console.log(user);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "password changed"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req?.user, "user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, website, bio, github, linkedin, avatar } = req.body;

  if (email?.trim()) {
    const userExist = await User.findOne({
      email,
      _id: { $ne: req.user?._id },
    });

    if (userExist) {
      throw new ApiError(409, "Email already in use");
    }
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName || user.fullName,
        email: email || user.email,
        website: website || user.website,
        bio: bio || user.bio,
        github: github || user.github,
        linkedin: linkedin || user.linkedin,
        avatar: avatar || user.avatar,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Details updated Successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {

  console.log(req.body.avatar);
  
  const avatarFile = req.file;
  
  console.log(avatarFile);

  if (!avatarFile) {
    throw new ApiError(400, "Avatar is required");
  }
  
  
  const avatar = await uploadOnCloudinary(avatarFile.buffer, avatarFile.originalname);

  
  if (avatar) {
    console.log("Upload successful:", avatar);
} else {
    console.log("Upload failed or returned null");
}
  
  // console.log(avatar.url);

  if (!avatar.url) {
    throw new ApiError(400, "failed while Uploading on cloudinary");
  }
  const oldAvatar = req.user.avatar;
  console.log("old", oldAvatar);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  // console.log(user.avatar);
try {
  const deleted = await deleteFromCloudinary(oldAvatar);
  console.log(deleted);
} catch (error) {
  console.error("Error deleting old avatar from Cloudinary:", error);
}
  
  return res.status(200).json(new ApiResponse(200, user, "Avatar changed"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username Missing!!");
  }
  // console.log(username);

  const userId = req.user?._id;

  const userProfile = await User.aggregate([
    {
      $match: {
        username: username.trim(),
      },
    },
    {
      $lookup: {
        from: "snippets",
        localField: "_id",
        foreignField: "owner",
        as: "snippets",
        pipeline: [
          {
            $lookup: {
              from: "versions",
              localField: "currentVersion",
              foreignField: "_id",
              as: "currentVersion",
            },
          },
          {
            $addFields: {
              currentVersion: {
                $first: "$currentVersion",
              },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $sort: {
              createdAt : -1
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "collections",
        localField: "_id",
        foreignField: "owner",
        as: "collectionCount",
      },
    },

    {
      $addFields: {
        snippetCount: {
          $size: "$snippets",
        },
        collectionCount: {
          $size: "$collectionCount",
        },
      },
    },
    // {
    //   $project: {
    //     _id: 1,
    //     username: 1,
    //     fullName: 1,
    //     avatar: 1,
    //     bio: 1,
    //     github: 1,
    //     linkedin: 1,
    //     website: 1,
    //     snippetCount: 1,
    //     createdAt: 1,
    //     updatedAt: 1,
    //   },
    // },
  ]);

  console.log(userProfile);
  

 

  if (userProfile.length === 0) {
    throw new ApiError(404, "channel does not exist");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userProfile[0],
        "User Channel Profile fetched successfully"
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  // const likedVideos = await Vote.find({
  //     video: { $ne: null },
  //     likedBy: req?.user?._id,
  // })
  //     .populate("video")
  //     .populate("owner", "username avatar fullName");

  const likedVideos = await Vote.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id),
        video: { $ne: null },
        isLiked: true,
      },
    },
    {
      $project: {
        video: 1,
        _id: 0,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    avatar: 1,
                    username: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        video: {
          $first: "$video",
        },
      },
    },
    {
      $project: {
        _id: "$video._id",
        videoFile: "$video.videoFile",
        thumbnail: "$video.thumbnail",
        title: "$video.title",
        description: "$video.description",
        duration: "$video.duration",
        views: "$video.views",
        isPublished: "$video.isPublished",
        owner: "$video.owner",
        createdAt: "$video.createdAt",
        updatedAt: "$video.updatedAt",
        __v: "$video.__v",
      },
    },
  ]);

  if (!likedVideos) {
    throw new ApiError(404, "No liked snippets found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "successfully fetched liked videos")
    );
});

const getMySnippets = asyncHandler(async (req, res) => {
  const snippets = await Snippet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "versions",
        localField: "currentVersion",
        foreignField: "_id",
        as: "currentVersion",
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "snippet",
        as: "commentCount",
      },
    },
    {
      $lookup: {
        from: "votes",
        localField: "_id",
        foreignField: "snippet",
        as: "upVoteCount",
        pipeline: [
          {
            $match: {
              isUpVote: true,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "votes",
        localField: "_id",
        foreignField: "snippet",
        as: "downVoteCount",
        pipeline: [
          {
            $match: {
              isUpVote: false,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $arrayElemAt: ["$owner", 0] },
        currentVersion: { $arrayElemAt: ["$currentVersion", 0] },

        voteCount: {
          $subtract: [{ $size: "$upVoteCount" }, { $size: "$downVoteCount" }],
        },
        commentCount: { $size: "$commentCount" },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        upVoteCount: 0,
        downVoteCount: 0,
      },
    },
  ]);
  if (!snippets) {
    throw new ApiError(404, "No snippets found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, snippets, "All snippets fetched successfully"));
});

// const changeUsername

export {
  registerUser,
  userLogin,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  getUserChannelProfile,
  getLikedVideos,
  getMySnippets,
};
