"use strict";

const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
const axios = serviceLocator.get("axios");
const user = mongoose.model("user");
const jsend = serviceLocator.get("jsend");
const _ = serviceLocator.get("_");
const multer = serviceLocator.get("multer");
const jwt = serviceLocator.get("jwt");
const config = require("../configs/configs")();
const bcrypt = serviceLocator.get("bcrypt");
const nodemailer = serviceLocator.get("nodemailer");
const moment = serviceLocator.get("moment");
const fs = require('fs').promises;


class USER {
  async createUserProflie(req, res) {
    try {

      if (req.payload.role === "staff") {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          return jsend(406, "token is required");
        }
        let findUser;
        var decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ["HS256"] });

        if (decoded) {
          findUser = await user.findOne({ _id: decoded._id, $or: [{ role: 'super-admin' }, { role: 'admin' }] });

          if (!findUser) {
            return jsend(406, "Un-Authorized Access");
          }
        } else {
          return jsend(406, "Un-Authorized Access");
        }
      }
      // already exist
      const userExist = await user.findOne({ email: req.payload.email });


      if (userExist) {
        return jsend(400, "Email already existing");
      }

      // Token Generate
      let jwtSecretKey = config.jwt.secretKey;
      let expiration = config.jwt.expiration;

      let users = new user(req.payload);
      let userID = users._id;

      // const salt = await bcrypt.genSalt(10);
      users.password = await bcrypt.hashSync(req.payload.password, 10);

      // Set Token
      users.token = await jwt.sign({ _id: userID, role: users.role }, jwtSecretKey, { expiresIn: expiration });

      // create-user
      users = await users.save();
      return jsend(200, "Successfully User Profile was Created ", users);
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // update user

  async updateUser(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return jsend(406, "token is required");
      }
      let checkAccess;
      var decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ["HS256"] });

      if (decoded) {
        checkAccess = await user.findOne({ _id: decoded._id });

        if (!checkAccess) {
          return jsend(406, "Un-Authorized Access");
        }
      } else {
        return jsend(406, "Un-Authorized Access");
      }

      //    data pass of values
      let updateCourse = await user.findOne({ _id: req.payload.userId });
      if (updateCourse) {
        _.each(Object.keys(req.payload), (key) => {
          updateCourse[key] = req.payload[key];
        });
        // const result = await user.save();
        updateCourse = await updateCourse.save();
        const updated = await user.findOne({ _id: req.payload.userId });

        return jsend(200, "User details updated successfully", updated);
      } else {
        return jsend(400, "Failed to Update the User details ");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // delete user

  async deleteUser(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return jsend(406, "token is required");
      }
      let checkAccess;
      var decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ["HS256"] });

      if (decoded) {
        checkAccess = await user.findOne({ _id: decoded._id, $or: [{ role: 'super-admin' }, { role: 'admin' }] });

        if (!checkAccess) {
          return jsend(406, "Un-Authorized Access");
        }
      } else {
        return jsend(406, "Un-Authorized Access");
      }
      // delete user details
      let deleteUserDetails = await user.findOne({ _id: req.query.userId });
      if (deleteUserDetails) {
        let deleteUserDetailss = await user.deleteOne({ _id: req.query.userId });
        return jsend(200, "User Profile deleted successfully");
      } else {
        return jsend(400, "Failed to delete the user profile");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // find particular user
  async findOneUser(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return jsend(406, "token is required");
      }
      let findUser;
      var decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ["HS256"] });

      if (decoded) {
        findUser = await user.findOne({ _id: decoded._id, $or: [{ role: 'super-admin' }, { role: 'admin' }, { _id: req.query.userId }] });

        if (!findUser) {
          return jsend(406, "Un-Authorized Access");
        }
      } else {
        return jsend(406, "Un-Authorized Access");
      }

      let userLogIndetails = await user.findOne({ _id: req.query.userId });

      if (findUser) {
        return jsend(
          200,
          "Successfully fetched particular user profile",
          userLogIndetails
        );
      } else {
        return jsend(400, "Failed to fetch the user profile");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // find All user
  async findAllUser(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return jsend(406, "token is required");
      }
      let checkAccess;
      var decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ["HS256"] });

      if (decoded) {
        checkAccess = await user.findOne({ _id: decoded._id, $or: [{ role: 'super-admin' }, { role: 'admin' }] });

        if (!checkAccess) {
          return jsend(406, "Un-Authorized Access");
        }
      } else {
        return jsend(406, "Un-Authorized Access");
      }

      let findUser = await user.find({});
      if (findUser) {
        return jsend(
          200,
          "Successfully fetched the user profile",
          findUser
        );
      } else {
        return jsend(400, "Failed to fetch the user profile");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // userLogin Details
  async loginDetails(req, res) {
    try {
      let userLogIndetails;
      let userID = "";
      userLogIndetails = await user.findOne({ email: req.payload.email });

      if (!userLogIndetails) {
      } else {
        userID = userLogIndetails._id;
      }
      let jwtSecretKey = config.jwt.secretKey;
      let expiration = config.jwt.expiration;
      if (userLogIndetails) {
        let passwordcheck = await bcrypt.compareSync(req.payload.password, userLogIndetails.password);
        if (passwordcheck) {
          userLogIndetails.token = await jwt.sign({ _id: userID }, jwtSecretKey, { expiresIn: expiration });

          return jsend(200, "Login successful", userLogIndetails);
        } else {
          return jsend(400, "Invalid password or email ID");
        }
      } else {
        return jsend(400, "User not found");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

}
module.exports = USER;
