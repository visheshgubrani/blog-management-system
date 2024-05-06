import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async(req, res) => {
    const {username, email, password, fullName} = req.body

    if (!(username && email && password && fullName)) {
        throw new ApiError(400, "Please enter all the details")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if (existedUser) {
        throw new ApiError(400, "User Already Exists")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        fullName
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(400, "Failed to create a user")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
    )
})

export {
    registerUser
}