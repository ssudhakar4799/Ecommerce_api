"use strict";

const serviceLocator = require("../lib/service_locator");
const config = require("./configs")();


serviceLocator.register("logger", () => {
  return require("../lib/logger").create(config.application_logging);
});



serviceLocator.register("joi", () => {
  return require("joi");
});

serviceLocator.register("otpgenerator", () => {
  return require("otp-generator");
});


serviceLocator.register("jsend", () => {
  return require("../lib/jsend");
});

serviceLocator.register("failAction", () => {
  return require("../lib/failAction").verify;
});

serviceLocator.register("trimRequest", () => {
  return require("../utils/trimRequest").all;
});

serviceLocator.register("mongoose", () => {
  return require("mongoose");
});

serviceLocator.register("axios", () => {
  return require("axios");
});

serviceLocator.register("bcrypt", () => {
  return require("bcrypt");
});

serviceLocator.register("multer", () => {
  return require("multer");
});

serviceLocator.register("fs", () => {
  return require("fs");
});

serviceLocator.register("path", () => {
  return require("path");
});

serviceLocator.register("nodemailer", () => {
  return require("nodemailer");
});

serviceLocator.register("jwt", () => {
  return require("jsonwebtoken");
});

serviceLocator.register("moment", () => {
  return require("moment");
});


serviceLocator.register("_", () => {
  return require("underscore");
});

serviceLocator.register("glob", () => {
  return require("glob");
});



serviceLocator.register("User", (serviceLocator) => {

  const User = require("../services/user");

  return new User();

});


serviceLocator.register("ProductModule", (serviceLocator) => {

  const ProductModule = require("../services/product");

  return new ProductModule();

});


serviceLocator.register("ProductOrderModule", (serviceLocator) => {

  const ProductOrderModule = require("../services/productOrder");

  return new ProductOrderModule();

});

serviceLocator.register("Uploads", (serviceLocator) => {

  const Uploads = require("../services/uploadsService");

  return new Uploads();

});


module.exports = serviceLocator;
