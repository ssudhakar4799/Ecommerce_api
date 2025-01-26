"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
const productOrderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        quantity: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
      },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("order", productOrderSchema, "order");
