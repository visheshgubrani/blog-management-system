import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateTokens } from "../utils/generateTokens.js";

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

const loginUser = asyncHandler(async(req, res) => {
    const {username, email, password} = req.body
    if (!(username || email) && !password) {
        throw new ApiError(400, "Please Enter the details")
    }

    const user = await User.find({
        $or: [{email}, {username}]
    })

    if (!user) {
        throw new ApiError(400, "user does not exist")
    }

    const isPasswordCorrect = await User.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Password is incorrecat")
    }

    const {accessToken, refreshToken} = await generateTokens(user?._id)

    const loggenInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, loggenInUser, "User loggedin successfully")
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    const user = req.user?._id
    await User.findByIdAndUpdate(
        user,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {new: true}
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken", options)
    .clearCookie("refreshToken", options).json(
        new ApiResponse(200, {}, "User logged out successfully")
    )
})
export {
    registerUser,
    loginUser
}