"use strict";

const serviceLocator = require("../lib/service_locator");
const trimRequest = serviceLocator.get("trimRequest");
const failAction = serviceLocator.get("failAction");
const user = serviceLocator.get("User");

exports.routes = (server, serviceLocator) => {
    return server.route([
        {

            path: "/Ecommerce/createUserProflie",
            method: "POST",
            handler: user.createUserProflie,
            options: {
                auth: false,
                // validate: {
                //     payload: require('../validations/user/createUserVaildation'),
                //     failAction: failAction
                // }
            },
        },
        {

            path: "/Ecommerce/updateUser",
            method: "PUT",
            handler: user.updateUser,
            options: {
                auth: false,
                // validate: {
                //     payload: require('../validations/user/updateUserVaildation'),
                //     failAction: failAction
                // }
            },
        },
        {

            path: "/Ecommerce/deletUser",
            method: "DELETE",
            handler: user.deleteUser,
            options: {
                auth: false,
                // validate: {
                //     payload: require('../validations/user/deleteUserVaildation'),
                //     failAction: failAction
                // }
            },

        },
        {

            path: "/Ecommerce/findOneUser",
            method: "GET",
            handler: user.findOneUser,
            options: {
                auth: false,
                // validate: {
                //     payload: require('../validations/user/findOneUserDetails'),
                //     failAction: failAction
                // }
            },

        },
        {

            path: "/Ecommerce/findAllUser",
            method: "GET",
            handler: user.findAllUser,
            options: {
                auth: false,
                // validate: {
                //     payload: require('../validations/user/findAllUserDetails'),
                //     failAction: failAction
                // }
            },

        },
        {

            path: "/Ecommerce/loginDetails",
            method: "POST",
            handler: user.loginDetails,
            options: {
                auth: false,
                // validate: {
                //     payload: require('../validations/user/loginDetails'),
                //     failAction: failAction
                // }
            },

        }
    ]);

};