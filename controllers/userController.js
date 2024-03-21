const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"});
};

// Register User
//wrap everything in asyncHandler and we can get rid of try catch block
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    // console.log(req.body);

    // validation
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please fill all required fields");
    }

    if(password.length < 8){
        res.status(400);
        throw new Error("Password must be atleast 8 characters");
    }

    // chk if email already exists
    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error("Email has already been registered");
    }

    //create new user
    const user = await User.create({
        name,
        email,
        password,
    });

    //generate token
    const token = generateToken(user._id);

    //send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true
    });

    if(user){
        const {_id, name, email, photo, phone, bio} = user;

        console.log("user registered");

        res.status(201)
           .json({_id, name, email, photo, phone, bio, token});
    }

    else{
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// Login User
const loginUser = asyncHandler( async (req, res) => {
    // res.send('login user');

    const {email, password} = req.body;

    // validate request
    if(!email || !password){
        res.status(400);
        throw new Error("Please add email and password");
    }

    // chk if user exists
    const user = await User.findOne({email});

    if(!user){
       res.status(400);
       throw new Error("User not found, please signup");
    }

    // user exists, now chk if pwd right or wrong
    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    //generate token
    const token = generateToken(user._id);

    if(passwordIsCorrect){
        //send HTTP-only cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1 day
            sameSite: "none",
            secure: true
        });
    }

    if(user && passwordIsCorrect) {
        const {_id, name, email, photo, phone, bio} = user;

        console.log("user logged in");

        res.status(200)
           .json({_id, name, email, photo, phone, bio, token});
    }

    else{
        res.status(400);
        throw new Error("Invalid email or password");
    }
});

// logout user
const logout = asyncHandler( async (req, res) => {
    // res.send("logout user");

    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true
    });

    console.log("user logged out");

    return res
            .status(200)
            .json({ message: "Successfully logged out!" });
});

// get user data
const getUser = asyncHandler( async (req, res) => {
    // res.send('get user data');

    const user = await User.findById(req.user._id);

    if(user){
        const {_id, name, email, photo, phone, bio} = user;

        res.status(200)
           .json({_id, name, email, photo, phone, bio});
    }

    else{
        res.status(400);
        throw new Error("User not found");
    }
});

module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser
};