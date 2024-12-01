import mongoose from "mongoose";
import { Collection } from "../Models/collection.model.js";

import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const createCollection = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required");
  }

  const collection = await Collection.create({
    owner: req.user._id,
    name,
    description: description || "",
  });

  if (!collection) {
    throw new ApiError(500, "Something went wrong while creating collection");
  }

  res
    .status(201)
    .json(new ApiResponse(201, collection, "Collection successfully created"));
});

const getCollectionDetails = asyncHandler(async (req, res) => {
  const { collectionId } = req.params;

  if (!collectionId) {
    throw new ApiError(400, "Collection ID is required");
  }

  const collection = await Collection.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(collectionId) },
    },
    {
      $lookup: {
        from: "snippets",
        localField: "snippets",
        foreignField: "_id",
        as: "snippets",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as : "owner",
              pipeline : [
                {
                  $project : {
                    username : 1,
                    fullName : 1,
                    avatar : 1
                  }
                }
              ]
            }
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
            $lookup : {
              from : 'votes',
              localField : '_id',
              foreignField : 'snippet',
              as : "upVotes",
              pipeline : [
                {
                  $match : {
                    isUpVote : true
                  }
                },
                
              ]
            },
            
          },
          {
            $lookup : {
              from : "votes",
              localField : "_id",
              foreignField : "snippet",
              as : "downVotes",
              pipeline : [
                {
                  $match : {
                    isUpVote : false
                  }
                }
              ]
            }
          },
          {
            $lookup : {
              from : "comments",
              localField : "_id",
              foreignField : "snippet",
              as : "commentCount"
            }
          },
          {
            $addFields: {
              category: {
                $first: "$category",
              },
            
            currentVersion: {
              $first: "$currentVersion",
            },
            voteCount : {
              $subtract : [
                {
                  $size : "$upVotes"
                },
                {
                  $size : "$downVotes"
                }
              ]
            },
            commentCount : {
              $size : "$commentCount"
          },
          owner : {
            $first : "$owner"
          }
          },
        },{
          $project : {
            upVotes : 0,
            downVotes : 0,
          }
        }
        ],
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
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);

  // const collection = await Collection.findById(collectionId);

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  res.status(200).json(new ApiResponse(200, collection[0], "Collection details"));
});

const addSnippetToCollection = asyncHandler(async (req, res) => {
  const { collectionId, snippetId } = req.params;

  const collection = await Collection.findById(collectionId);

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  collection.snippets.push(snippetId);
  await collection.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        collection,
        "Snippet successfully added to collection"
      )
    );
});

const removeSnippetFromCollection = asyncHandler(async (req, res) => {
  const { collectionId, snippetId } = req.params;

  const collection = await Collection.findById(collectionId);

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  collection.snippets = collection.snippets.filter(
    (snippet) => snippet.toString() !== snippetId
  );
  await collection.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        collection,
        "Snippet successfully removed from collection"
      )
    );
});

const deleteCollection = asyncHandler(async (req, res) => {
  const { collectionId } = req.params;

  const collection = await Collection.findByIdAndDelete(collectionId);

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  // await collection.remove();

  res
    .status(200)
    .json(new ApiResponse(200, collection, "Collection successfully deleted"));
});

const getCollections = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const collections = await Collection.find({ owner: user._id });

  // const collections = await Collection.find({ owner: user._id }).populate("snippets").populate("currentVersion").populate("owner");

  res.status(200).json(new ApiResponse(200, collections, "All collections"));
});

export {
  createCollection,
  addSnippetToCollection,
  removeSnippetFromCollection,
  deleteCollection,
  getCollections,
  getCollectionDetails,
};
