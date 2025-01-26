"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        oldPrice: { type: Number },
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        expiryDate: { type: Date },
        deliveryCost: { type: Number, default: 0 },
        freeDelivery: { type: Boolean, default: false },
        url: { type: String, unique: true, required: true },
        images: [{ type: String }],
        startDate: { type: Date, required: true },
      },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("product", productSchema, "product");
