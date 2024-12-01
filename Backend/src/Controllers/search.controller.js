// Snippet Search Controller
import mongoose from 'mongoose';
import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from '../Utils/asyncHandler.js';

const searchSnippets = asyncHandler(async (req, res) => {
  // Destructure query parameters from request with default values
  const {
    query = "",
    category = null,
    language = null,
    minVotes = 0,
    sortBy = "voteCount",
    sortOrder = "desc",
    page = 1,
    limit = 20,
    owner = null,
    dateFrom = null,
    dateTo = null,
    tags = [],
  // Destructure query parameters from the request query string with default values
  } = req.query;

  // Initialize the aggregation pipeline to build the query stages
  // Initialize the aggregation pipeline to build the query stages
  const pipeline = [];

  // Text search stage: This stage performs a full-text search on the "title", "description", and "currentVersion.code" fields using the provided query.
  // Text search stage
  if (query) {
    pipeline.push({
      $search: {
        index: "search",
        text: {
          query: query,
          path: ["title", "description", "currentVersion.code"],
          fuzzy: {
            maxEdits: 1,
            prefixLength: 3,
          },
        },
      },
    });
  }

  // Lookups for related collections (similar to original aggregation)
  pipeline.push(
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
    // Comments lookup
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "snippet",
        as: "commentCount",
      },
    },
    // Upvotes lookup
    {
      $lookup: {
        from: "votes",
        localField: "_id",
        foreignField: "snippet",
        as: "upVoteCount",
        pipeline: [{ $match: { isUpVote: true } }],
      },
    },
    // Downvotes lookup
    {
      $lookup: {
        from: "votes",
        localField: "_id",
        foreignField: "snippet",
        as: "downVoteCount",
        pipeline: [{ $match: { isUpVote: false } }],
      },
    }
  );

  // Filtering stages
  const matchStage = { $match: {} };

  // Category filter
  if (category) {
    matchStage.$match["category.name"] = category;
  }

  // Language filter
  if (language) {
    matchStage.$match["language"] = language;
  }

  // Owner filter
  if (owner) {
    matchStage.$match.$or = [
      { "owner.username": owner },
      { "owner.fullName": owner },
    ];
  }

  // Date range filter
  if (dateFrom || dateTo) {
    matchStage.$match.createdAt = {};
    if (dateFrom) matchStage.$match.createdAt.$gte = new Date(dateFrom);
    if (dateTo) matchStage.$match.createdAt.$lte = new Date(dateTo);
  }

  // Tags filter
  if (tags && tags.length > 0) {
    matchStage.$match.tags = { $elemMatch: { $in: tags } };
  }

  // Minimum votes filter
  matchStage.$match["$expr"] = {
    $gte: [
      { $subtract: [{ $size: "$upVoteCount" }, { $size: "$downVoteCount" }] },
      Number(minVotes),
    ],
  };

  // Add match stage if not empty
  if (Object.keys(matchStage.$match).length > 0) {
    pipeline.push(matchStage);
  }

  // Add fields stage
  pipeline.push({
    $addFields: {
      owner: { $arrayElemAt: ["$owner", 0] },
      currentVersion: { $arrayElemAt: ["$currentVersion", 0] },
      voteCount: {
        $subtract: [{ $size: "$upVoteCount" }, { $size: "$downVoteCount" }],
      },
      commentCount: { $size: "$commentCount" },
    },
  });

  // Sorting stage
  const sortStage = { $sort: {} };
  sortStage.$sort[sortBy] = sortOrder === "desc" ? -1 : 1;
  pipeline.push(sortStage);

  // Pagination stages
  pipeline.push(
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: Number(limit),
    }
  );

  // Final projection
  pipeline.push({
    $project: {
      upVoteCount: 0,
      downVoteCount: 0,
      "owner.password": 0,
      "owner.email": 0,
    },
  });

  // Count total documents for pagination
  const countPipeline = [...pipeline.slice(0, -2)];
  countPipeline.push({ $count: "totalCount" });

  // Execute aggregations
  const [snippets, countResult] = await Promise.all([
    mongoose.model("Snippet").aggregate(pipeline),
    mongoose.model("Snippet").aggregate(countPipeline),
  ]);

  // Prepare response
  res.json(
    new ApiResponse(
        200,{
            snippets,
            pagination: {
              currentPage: page,
              limit,
              totalCount: countResult[0] ? countResult[0].totalCount : 0,
              totalPages: Math.ceil((countResult[0]?.totalCount || 0) / limit),
            },
          },
          "search results fetched successfully"
    )
  );
});

const autocompleteSearch = asyncHandler(async (req, res) => {
  
    const { query } = req.query;
    console.log(query);
    if (!query || query.length < 2) {
      return res.json([]);
    }

    const pipeline = [
      {
        $search: {
          index: "snippetAutocompleteIndex", // Separate index for autocomplete
          compound: {
            should: [
              {
                autocomplete: {
                  query: query,
                  path: "title",
                  tokenOrder: "sequential",
                },
              },
              {
                autocomplete: {
                  query: query,
                  path: "tags",
                  tokenOrder: "sequential",
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          title: 1,
          language: 1,
          tags: 1,
        },
      },
      {
        $limit: 5, // Limit autocomplete results
      },
    ];

    const results = await mongoose.model("Snippet").aggregate(pipeline);
    res
      .status(200)
      .json(new ApiResponse(200, results, "Autocomplete search results"));
  
});

// Express route setup example
// router.get('/search', SnippetSearchController.searchSnippets);
// router.get('/autocomplete', SnippetSearchController.autocompleteSearch);

export default { searchSnippets, autocompleteSearch };

// module.exports = SnippetSearchController;
