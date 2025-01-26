"use strict";

const serviceLocator = require("../../lib/service_locator");
const joi = serviceLocator.get("joi");
module.exports = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
    countryCode:joi.string().required(),
    companyName:joi.string().optional(),
    postalCode:joi.string().optional(),
    city:joi.string().optional(),
    address:joi.string().optional(),
    userType:joi.string().optional(),
    userName:joi.string().optional(),
    access:joi.object().optional(),
    industry:joi.string().optional(),
});