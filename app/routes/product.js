const serviceLocator = require("../lib/service_locator");
const trimRequest = serviceLocator.get("trimRequest");
const failAction = serviceLocator.get("failAction");
const Product = serviceLocator.get("ProductModule");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
    return server.route([
        {
            path: "/Ecommerce/createProduct",
            method: "POST",
            options: {
                auth: false,
                validate: {
                    failAction: failAction,
                },
                payload: {
                    parse: true,
                    allow: "multipart/form-data",
                    multipart: { output: "stream" },
                },
                handler: async (request, h) => {
                    try {
                        const response = await Product.createProduct(request, h);
                        return jsend(response);
                    } catch (error) {
                        console.error(error);
                        return jsend(406, error.message)
                    }
                },
            },
        },
        {
          path: "/Ecommerce/updateProduct",
          method: "PUT",
          options: {
              auth: false,
              validate: {
                  failAction: failAction,
              },
              payload: {
                  parse: true,
                  allow: "multipart/form-data",
                  multipart: { output: "stream" },
              },
              handler: async (request, h) => {
                  try {
                      const response = await Product.updateProduct(request, h);
                      return jsend(response);
                  } catch (error) {
                      console.error(error);
                      return jsend(406, error.message)
                  }
              },
          },
      },
      {

        path: "/Ecommerce/findOneProduct",
        method: "GET",
        handler: Product.findOneProduct,
        options: {
            auth: false,
            // validate: {
            //     payload: require('../validations/user/findOneUserDetails'),
            //     failAction: failAction
            // }
        },

    },
    {

        path: "/Ecommerce/findAllProduct",
        method: "GET",
        handler: Product.findAllProduct,
        options: {
            auth: false,
            // validate: {
            //     payload: require('../validations/user/findAllUserDetails'),
            //     failAction: failAction
            // }
        },

    },
    {

        path: "/Ecommerce/deleteProduct",
        method: "DELETE",
        handler: Product.deleteProduct,
        options: {
            auth: false,
            // validate: {
            //     payload: require('../validations/user/findAllUserDetails'),
            //     failAction: failAction
            // }
        },

    },
    {

        path: "/Ecommerce/getPaginatedProducts",
        method: "POST",
        handler: Product.getPaginatedProducts,
        options: {
            auth: false,
            // validate: {
            //     payload: require('../validations/user/findAllUserDetails'),
            //     failAction: failAction
            // }
        },

    },
    ]);
};
