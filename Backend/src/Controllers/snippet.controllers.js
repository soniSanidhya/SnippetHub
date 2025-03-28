import mongoose, { set } from "mongoose";
import { Category } from "../Models/category.model.js";
import { Snippet } from "../Models/snippet.model.js";
import { Version } from "../Models/version.model.js";
import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";

const addSnippet = asyncHandler(async (req, res) => {
  const { title, code, language, tags, documentation, category, description } =
    req.body;

  if (!title || !code || !language) {
    throw new ApiError(400, "Please provide all the required fields");
  }
  console.log(category);
  let categ = await Category.findOne({ name: category });
  console.log(categ);
  if (!categ) {
    console.log("Category not found");

    categ = await Category.create({ name: category });
  }

  const tagsArray = tags.split(",").map((tag) => tag.trim());

  console.log(categ);

  console.log(categ?._id);
  const snippet = await Snippet.create({
    owner: req.user._id,
    title,
    language,
    documentation,
    description,
    tags: tagsArray,
    category: categ._id,
  });

  const version = await Version.create({
    snippet: snippet._id,
    version: 1.0,
    updatedCode: code,
  });

  snippet.currentVersion = version._id;
  await snippet.save();

  version.snippet = snippet._id;
  await version.save();

  if (!snippet) {
    throw new ApiError(500, "Something went wrong while adding snippet");
  }

  res
    .status(201)
    .json(new ApiResponse(201, snippet, "Snippet successfully added"));
});

const editSnippet = asyncHandler(async (req, res) => {
  const { snippetId } = req.params;
  const { title, description, code, tags, documentation } = req.body;

  console.log("body ", req.body);

  if (!snippetId) {
    throw new ApiError(400, "Snippet Id is required");
  }

  const snippet = await Snippet.findById(snippetId);
  console.log(snippetId);

  const currentVersion = await Version.findById(snippet.currentVersion);
  if (!snippet) {
    throw new ApiError(404, "Snippet not found");
  }

  let snippetUpdate;
  if (code !== snippet.currentVersion.updatedCode) {
    console.log("code ", code);

    const version = await Version.create({
      snippet: snippet._id,
      version: parseInt((currentVersion.version + 0.1) * 100) / 100,
      updatedCode: code,
    });

    snippetUpdate = await Snippet.findByIdAndUpdate(
      snippetId,
      {
        title: title || snippet.title,
        description: description || snippet.description,
        currentVersion: version._id,
        tags: tags?.split(",").map((tag) => tag.trim()) || snippet.tags,
        documentation: documentation || snippet.documentation,
      },
      {
        new: true,
      }
    );
  } else {
    snippetUpdate = await Snippet.findByIdAndUpdate(
      snippetId,
      {
        title: title || snippet.title,
        description: description || snippet.description,
        tags: tags?.split(",").map((tag) => tag.trim()) || snippet.tags,
        documentation: documentation || snippet.documentation,
      },
      {
        new: true,
      }
    );
  }

  if (!snippetUpdate) {
    throw new ApiError(500, "Something went wrong while updating snippet");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { snippet }, "Snippet successfully updated"));
});

const getSnippets = asyncHandler(async (req, res) => {
  // const snippets = await Snippet.find().populate("currentVersion").populate("category").populate("owner");

  const snippets = await Snippet.aggregate([
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
        voteCount: -1,
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
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No snippets found"));
  }
  res.status(200).json(new ApiResponse(200, snippets, "All snippets"));
});

const getSnippetVersions = asyncHandler(async (req, res) => {
  const { snippetId } = req.params;

  if (!snippetId) {
    throw new ApiError(400, "Snippet Id is required");
  }

  const versions = await Version.find({ snippet: snippetId }).sort({
    createdAt: -1,
  });
  if (!versions) {
    throw new ApiError(404, "No versions found");
  }
  res.status(200).json(new ApiResponse(200, versions, "All versions"));
});

const deleteSnippet = asyncHandler(async (req, res) => {
  const { snippetId } = req.params;
  const snippet = await Snippet.findById(snippetId);
  // const snippet = await Snippet.findByIdAndDelete(snippetId);

  if (!snippet) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Snippet not found"));
  }

  const versions = await Version.find({ snippet: snippetId });

  if (!versions) {
    throw new ApiError(404, "No versions found");
  }

  versions.forEach(async (version) => {
    await Version.deleteOne({ _id: version._id });
  });

  const deletedSnippet = await Snippet.deleteOne({ _id: snippetId });

  if (!deletedSnippet) {
    throw new ApiError(500, "Something went wrong while deleting snippet");
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Snippet deleted successfully"));
});

const deleteVersion = asyncHandler(async (req, res) => {
  const { versionId } = req.params;

  const version = await Version.findById(versionId);

  const snippet = await Snippet.findById(version.snippet);

  if (!version || !snippet) {
    throw new ApiError(404, "Version not found");
  }

  if (snippet.currentVersion.toString() === versionId.toString()) {
    const olderVersion = await Version.findOne({
      snippet: snippet._id,
      _id: { $ne: versionId },
    }).sort({ version: -1 });
    if (!olderVersion) {
      throw new ApiError(404, "No older version found");
    }
    snippet.currentVersion = olderVersion._id;
    await snippet.save();
  }

  const deletedVersion = await Version.deleteOne({ _id: versionId });

  if (!deletedVersion) {
    throw new ApiError(500, "Something went wrong while deleting version");
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Version deleted successfully"));
});

const getSnippetDetails = asyncHandler(async (req, res) => {
  const { snippetId } = req.params;
  console.log(snippetId);

  const snippet = await Snippet.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(snippetId),
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
        voteCount: -1,
      },
    },
    {
      $project: {
        upVoteCount: 0,
        downVoteCount: 0,
      },
    },
  ]);
  if (!snippet) {
    throw new ApiError(404, "Snippet not found");
  }

  console.log(snippet);

  res.status(200).json(new ApiResponse(200, snippet[0], "Snippet details"));
});

const addView = asyncHandler(async (req, res) => {
  const { snippetId } = req.params;

  const snippet = await Snippet.findById(snippetId);

  if (!snippet) {
    throw new ApiError(404, "Snippet not found");
  }

  snippet.views += 1;
  await snippet.save();

  res.status(200).json(new ApiResponse(200, snippet, "View added"));
});

const getRecommendedSnippets = asyncHandler(async (req, res) => {
  // const { tags } = req.params;
  const tags = req.query.tags;
  console.log("params" , req.params);
  
  if (!tags) {
    throw new ApiError(400, "Please provide tags");
  }

  console.log(tags);
  

  const snippet = await Snippet.aggregate([
    {
      $match: {
       tags : { $in : tags }
      }
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
      $addFields : {
        owner : {
          $first : "$owner"
        }
      }
    }
  ]);

  console.log("recomeended " ,snippet);
  

  if (!snippet) {
    throw new ApiError(404, "No snippets found");
  }

  res.status(200).json(new ApiResponse(200, snippet, "Recommended snippets"));
});

export {
  addSnippet,
  editSnippet,
  getSnippets,
  getSnippetDetails,
  getSnippetVersions,
  getRecommendedSnippets,
  deleteSnippet,
  deleteVersion,
  addView,
};
