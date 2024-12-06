import mongoose from "mongoose";
import { Follow } from "../Models/follow.model.js";
import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";

const addFollower = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
       throw new ApiError(400, "User id is required");
    }

    if (req.user._id === userId) {
       throw new ApiError(400, "You can't follow yourself");
    }

    const isFollowing = await Follow.exists({follower : req.user._id , user : userId});

    let follow;
    if (isFollowing) {

        follow = await Follow.findOneAndDelete({
            follower: req.user._id,
            user: userId
        })
     
}else {
    follow = await Follow.create({
        follower: req.user._id,
        user: userId
    })
}

    if (!follow) {
        throw new ApiError(500, "Something went wrong while following user");
    }

    res.status(201).json(
      new ApiResponse(201, follow, "successfully followed user")
    )
})

const removeFollower = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
       throw new ApiError(400, "User id is required");
    }

    const follow = await Follow.findOneAndDelete({
        follower: req.user._id,
        user: userId
    })

    if (!follow) {
        throw new ApiError(404, "You are not following this user");
    }

    res.status(200).json(
      new ApiResponse(200, follow, "User successfully unfollowed")
    )
})

const getFollowers = asyncHandler(async (req, res) => {
    const {userId} = req.params;

    if (!userId) {
        throw new ApiError(400, "User id is required");
    }

    const followers = await Follow.find({
        user: userId
    }).populate('follower', 'username fullName avatar  -_id');

    // const followers = await Follow.aggregate([
    //     {
    //         $match : {
    //             user : new mongoose.Types.ObjectId(userId)
    //         }
    //     },
    //     {
    //         $lookup : {
    //             from : "users",
    //             localField : "follower",
    //             foreignField : "_id",
    //             as : "follower"
    //         }
    //     },
    //     {
    //         $unwind : "$follower"
        
    //     }
    // ])
    

    const followerCount = followers?.length || 0;
   
       
        if (!followers) {
            throw new ApiError(404, "No followers found");
        }
        // console.log();
        

    res.status(200).json(
        new ApiResponse(200, {followers : followers.map((follower)=> follower.follower) , followerCount }, "Followers found")
    )
})

const getFollowing = asyncHandler(async (req, res) => {
    const {userId} = req.params;

    if (!userId) {
        throw new ApiError(400, "User id is required");
    }

    const following = await Follow.find({
        follower: userId
    }).populate('user' ,  'username fullName avatar  -_id');
    const followingCount = following.length;

    if (!following) {
        throw new ApiError(404, "No following found");
    }

    res.status(200).json(
        new ApiResponse(200, {following : following.map(following => following.user), followingCount}, "Following found")
    )
})

const isFollowing = asyncHandler(async(req ,res)=>{

    const userId = req.params.userId;



    if (!userId ) {
        throw new ApiError(400, "User id is required");
    }

    if(mongoose.Types.ObjectId.isValid(userId) === false){
        throw new ApiError(400, "Invalid user id");
    }

    const isFollowing = await Follow.exists({follower : req.user._id , user : userId});

    
    res.status(200).json(new ApiResponse(200, isFollowing ? true : false  , "Following status retrieved"));
})

export {
    addFollower,
    removeFollower,
    getFollowers,
    getFollowing,
    isFollowing
}