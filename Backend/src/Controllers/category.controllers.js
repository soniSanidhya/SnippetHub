
import {Category} from "../Models/category.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getAllCategory = asyncHandler(async (req, res) => {

    const {page = 1 , limit = 10} = req.query;

    const categories = await Category.find().skip(
        (page-1)*limit
    ).limit(limit);
    res.status(200).json(
        new ApiResponse(200, categories , "Categories fetched successfully")
    );
})

export {getAllCategory};