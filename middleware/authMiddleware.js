const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler( async (req, res, next) => {
    console.log(req.body);
    console.log(req.cookies.token);
    
    try{
        const token = req.cookies.token;
        
        if(!token){
            res.status(401);
            throw new Error("Not authorized, please login");
        }

        // verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // get user id from token
        const user = await User.findById(verified.id).select("-password"); //we need everything except pwd

        if(!user) {
            res.status(401);
            throw new Error("User not found");
        }

        req.user = user;
        next();
    }

    catch(error) {
        res.status(401);
        throw new Error("Not authorized, please login");
    }
});

module.exports = protect;