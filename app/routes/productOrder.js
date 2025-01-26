"use strict";

const serviceLocator = require("../lib/service_locator");
const trimRequest = serviceLocator.get("trimRequest");
const failAction = serviceLocator.get("failAction");
const orderProduct = serviceLocator.get("ProductOrderModule");

exports.routes = (server, serviceLocator) => {
    return server.route([
        {

            path: "/Ecommerce/createOrderProduct",
            method: "POST",
            handler: orderProduct.createOrderProduct,
            options: {
                auth: false,
                // validate: {
                //     payload: require('../validations/user/createUserVaildation'),
                //     failAction: failAction
                // }
            },
        },
        {

            path: "/Ecommerce/findOneOrderProduct",
            method: "GET",
            handler: orderProduct.findOneOrderProduct,
            options: {
                auth: false,
                // validate: {
                //     payload: require('../validations/user/findOneUserDetails'),
                //     failAction: failAction
                // }
            },
    
        },
        {
    
            path: "/Ecommerce/findAllOrderProduct",
            method: "GET",
            handler: orderProduct.findAllOrderProduct,
            options: {
                auth: false,
                // validate: {
                //     payload: require('../validations/user/findAllUserDetails'),
                //     failAction: failAction
                // }
            },
    
        }
    ]);

};