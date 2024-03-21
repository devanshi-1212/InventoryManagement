const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },

    email: {
        type: String,
        required: [true, "Please add an email id"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email id"
        ]
    },

    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [8, "Password must be atleast 6 characters"]
    },

    photo: {
        type: String,
        required: [true, "Please add a profile photo"],
        default: "https://i.ibb.co/4pDNDk1/avatar.png"
    },

    phone: {
        type: String,
        default: "+91"
    },

    bio: {
        type: String,
        default: "Bio",
        maxLength: [250, "Password must be upto 250 characters"]
    }
}, {
    timestamps: true
});

// encrypt password before saving to db
userSchema.pre("save", async function(next) {

    if(!this.isModified("password")){
        return next();
    }

    // hash pwd
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;
})

const User = mongoose.model("User", userSchema);

module.exports = User;