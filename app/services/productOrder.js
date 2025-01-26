const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
const jsend = serviceLocator.get("jsend");
const _ = serviceLocator.get("_");
const Product = mongoose.model("product");
const fs = require('fs').promises;
const jwt = serviceLocator.get("jwt");
const config = require("../configs/configs")();
const moment = serviceLocator.get("moment");
const user = mongoose.model("user");

const ProductOrder = mongoose.model("order");
class ProductOrderModule {
    async createOrderProduct(req, res) {
        try {
            
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return jsend(406, "token is required");
            }

            let checkAccess;
            console.log(token,"---");

            var decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ["HS256"] });

            if (decoded) {
                checkAccess = await user.findOne({ _id: decoded._id });                
                if (!checkAccess) {
                    return jsend(406, "Un-Authorized Access");
                }
            } else {
                return jsend(406, "Un-Authorized Access");
            }
            console.log(req.payload);

            const { product, quantity, status } = req.payload;

            const existingProduct = await Product.findOne({ _id: product });
            if (!existingProduct) {
                return jsend(400, "Product not found");
            }

            const productPrice = existingProduct.price;
            const totalPrice = (productPrice * quantity).toFixed(2);

            const newOrder = new ProductOrder({
                user: checkAccess._id,
                product: existingProduct._id,
                quantity,
                totalPrice,
                status: status || "pending",
            });

            const savedOrder = await newOrder.save();

            return jsend(200, "Order created successfully", savedOrder);
        } catch (error) {
            console.error(error);
            return jsend(500, "Internal Server Error");
        }
    }

    // find particular user
async findOneOrderProduct(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return jsend(406, "token is required");
      }
      let findUser;
      var decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ["HS256"] });

      if (decoded) {
        findUser = await user.findOne({ _id: decoded._id });

        if (!findUser) {
          return jsend(406, "Un-Authorized Access");
        }
      } else {
        return jsend(406, "Un-Authorized Access");
      }

      let userLogIndetails = await ProductOrder.findOne({ _id: req.query.orderProductId });

      if (findUser) {
        return jsend(
          200,
          "Successfully fetched particular order product details",
          userLogIndetails
        );
      } else {
        return jsend(400, "Failed to fetch the order product details");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // find All user
  async findAllOrderProduct(req, res) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          return jsend(406, "token is required");
        }
        let findUser;
        var decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ["HS256"] });
  
        if (decoded) {
          findUser = await user.findOne({ _id: decoded._id });
  
          if (!findUser) {
            return jsend(406, "Un-Authorized Access");
          }
        } else {
          return jsend(406, "Un-Authorized Access");
        }
  
      let findProduct = await ProductOrder.find({});
      if (findProduct) {
        return jsend(
          200,
          "Successfully fetched the order product details",
          findProduct
        );
      } else {
        return jsend(400, "Failed to fetch the order product details");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

}

module.exports = ProductOrderModule;
