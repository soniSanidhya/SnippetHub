import { Snippet } from "../Models/snippet.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Collection } from "../Models/collection.model.js";
import { Vote } from "../Models/vote.model.js";

const getDashBoardDetails = asyncHandler(async (req, res) => {
    const snippetCount = await Snippet.find({owner : req.user._id}).countDocuments();
    const collectionCount = await Collection.find({owner : req.user._id}).countDocuments();
    const voteCount = await Vote.find({votedBy : req.user._id}).countDocuments();
    const upVoteCount = await Vote.aggregate([
        {
            $match : {
                isUpVote : true,
            }
        },
        {
            
            $lookup : {
                from : "snippets",
                localField : "snippet",
                foreignField : "_id",
                as : "upvoteCount",
                pipeline : [
                    {
                        $match : {
                            owner : req.user._id
                        }
                    }
                ]
            }
        },
        {
            $count : "upVoteCount"
        }
        
    ]);
    const views = await Snippet.aggregate([
        {
            $match : {
                owner : req.user._id
            }
        },
        {
            $group : {
                _id : null,
                totalViews : {
                    $sum : "$views"
                }
            }
        },
        {
            $project : {
                _id : 0,
                totalViews : 1
            }
        }
    ]);

    res.status(200).json(
        new ApiResponse(200, {snippetCount , collectionCount , voteCount , upVoteCount : upVoteCount[0].upVoteCount , views : views[0].totalViews }, "Dashboard details fetched successfully")
    );
});

export { getDashBoardDetails };