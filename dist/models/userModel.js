"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [
            3,
            "must be at least 3 charactors",
        ],
        maxlength: [
            20,
            "name can not exceed 20 charactors",
        ],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [
            4,
            "Password must be at least 4 charactors",
        ],
        select: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    profileImage: {
        url: {
            type: String,
        },
        publicId: {
            type: String,
        },
    },
}, {
    timestamps: true,
});
// ========================================
// HASH PASSWORD BEFORE SAVING
// ========================================
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 12);
});
// ========================================
// COMPARE PASSWORD DURING LOGIN
// ========================================
userSchema.methods.correctPassword =
    async function (candidatePassword, userPassword) {
        return bcrypt.compare(candidatePassword, userPassword);
    };
const User = mongoose.model("User", userSchema);
module.exports = User;
