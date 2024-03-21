const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");

const app = express();

//middlewares

//1. help us handle json data in application
app.use(express.json()); 
//2. help us handle data that come via url
app.use(express.urlencoded({extended: false}));
//3. body parser help us deal with data which comes from frontend to backend
app.use(bodyParser.json());

app.use(cookieParser());

// routes middleware
app.use("/api/users", userRoute);

//routes
app.get('/', (req, res) => {
    res.send("home page");
});

// error middleware
app.use(errorHandler);

// connect to mongodb and start server
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server running on port ${PORT}`);
        })
    })
    .catch((err) => console.log(err));