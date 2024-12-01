import jwt from "jsonwebtoken";
import { ApiError } from "../Utils/apiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authenticator")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unautorized Request");
        }
        const decode = jwt.decode(token);
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            throw new ApiError(401, "Invalid AccessToken");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error || "invalid token");
    }
});
