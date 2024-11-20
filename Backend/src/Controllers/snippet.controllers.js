import { set } from "mongoose";
import { Category } from "../Models/category.model.js";
import { Snippet } from "../Models/snippet.model.js";
import { Version } from "../Models/version.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addSnippet = asyncHandler(async (req, res) => {
  const { title, code, language, tags, documentation, category } = req.body;

  if (!title || !code || !language) {
    throw new ApiError(400, "Please provide all the required fields");
  }
  console.log(category);
  let categ = await Category.findOne({ name: category });
    console.log(categ);
  if (categ?.length === 0) {
    console.log("Category not found");
    
    categ = await Category.create({ name: category });
  }

  const tagsArray = tags.split(",").map((tag) => tag.trim());

  console.log(categ);
  

  const version = await Version.create({
    // snippet: snippet._id,
    version: 1.0,
    updatedCode: code,
  });

    console.log(categ._id);
  const snippet = await Snippet.create({
    owner: req.user._id,
    title,
    language,
    documentation,
    tags : tagsArray,
    category: categ._id,
    currentVersion: version._id,
  });

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
    const { code, tags , documentation } = req.body;

    if (!snippetId) {
        throw new ApiError(400, "Snippet Id is required");
    }



    const snippet = await Snippet.findById(snippetId);
    console.log(snippetId);
    
    const currentVersion = await Version.findById(snippet.currentVersion);
    if (!snippet) {
        throw new ApiError(404, "Snippet not found");
    }

    const version = await Version.create({
        snippet: snippet._id,
        version: parseInt((currentVersion.version + 0.1)*100)/100,
        updatedCode: code,
    });

    const snippetUpdate = await Snippet.findByIdAndUpdate(
        snippetId,
        {
            currentVersion: version._id,
            tags : tags?.split(",").map((tag) => tag.trim()) || snippet.tags,
            documentation : documentation || snippet.documentation
        },
        {
            new: true,
        }
    )

    if (!snippetUpdate) {
        throw new ApiError(500, "Something went wrong while updating snippet");
    }

    res.status(200).json(
        new ApiResponse(200, {snippet , version} , "Snippet successfully updated")
    );
})

const getSnippets = asyncHandler(async (req, res) => {
  const snippets = await Snippet.find().populate("currentVersion").populate("category").populate("owner");
  if (!snippets) {
    return res.status(404).json(new ApiResponse(404, null, "No snippets found"));
    
  }
  res.status(200).json(new ApiResponse(200, snippets, "All snippets"));
});


export { addSnippet , editSnippet , getSnippets};