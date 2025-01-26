"use strict";

const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
const { validateEmail, validatePassword } = require("../utils/validate")

var userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String, required: true,
            validate: validateEmail, unique: true
        },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['buyer', 'vendor', 'admin', 'super-admin','staff'],
            default: 'buyer',
        },
        token: {
            type: String,
            required: true
        }
    }, {
    timestamps: true
}
);
module.exports = mongoose.model("user", userSchema, "user");