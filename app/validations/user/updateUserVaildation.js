"use strict";

const serviceLocator = require("../../lib/service_locator");
const joi = serviceLocator.get("joi");
module.exports = joi.object({
    id:joi.string().required(),
    email: joi.string().optional(),
    password: joi.string().optional(),
    countryCode:joi.string().optional(),
    companyName:joi.string().optional(),
    postalCode:joi.string().optional(),
    city:joi.string().optional(),
    address:joi.string().optional(),
    userType:joi.string().optional()
});