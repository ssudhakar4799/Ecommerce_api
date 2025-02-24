"use strict";

const serviceLocator = require("../../lib/service_locator");
const joi = serviceLocator.get("joi");
module.exports = joi.object({
    id : joi.string().required(),
    password: joi.string().required(),
    conformPassword:joi.string().required(),
});