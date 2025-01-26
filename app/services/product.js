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

class ProductModule {
async createProduct(req, res) {
    try {
        const payload = req.payload;

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

        const { url, images } = payload;

        const mainImage = url;
        const mainImageFilename = mainImage.hapi.filename;
        const mainImageData = mainImage._data;
        const mainImagePath = `uploads/${mainImageFilename}`;

        await fs.writeFile(mainImagePath, mainImageData);

        let imagePaths = [];
        if (Array.isArray(images)) {
            for (let image of images) {
                const filename = image.hapi.filename;
                const data = image._data;
                const path = `uploads/${filename}`;
                await fs.writeFile(path, data);
                imagePaths.push(path); 
            }
        } else {
            const filename = images.hapi.filename;
            const data = images._data;
            const path = `uploads/${filename}`;
            await fs.writeFile(path, data);
            imagePaths.push(path); 
        }

    const expiryDate = moment(req.payload.startDate).add(7,"days").format("YYYY-MM-DD")
        const newAddProduct = new Product({
            ...payload,
            url: mainImagePath, 
            images: imagePaths, 
            vendor:checkAccess._id,
            expiryDate
        });

        

        // Save the new product to the database
        const savedProduct = await newAddProduct.save();

        // Respond with success message and created product details
        return jsend(200, "Product details created successfully", savedProduct);
    } catch (e) {
        console.error(e);
        // Handle errors appropriately
        return jsend(400, "Internal Server Error")
    }
}


async updateProduct(req, res) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return jsend(406, "token is required");
        }

        let checkAccess;
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ["HS256"] });

        if (decoded) {
            checkAccess = await user.findOne({ _id: decoded._id });
            if (!checkAccess) {
                return jsend(406, "Un-Authorized Access");
            }
        } else {
            return jsend(406, "Un-Authorized Access");
        }

        let updateProduct = await Product.findOne({ _id: req.payload.productId });

        if (!updateProduct) {
            return jsend(400, "Product not found");
        }

        const { url, images, startDate } = req.payload;

        if (url) {
            const mainImage = url;
            const mainImageFilename = mainImage.hapi.filename;
            const mainImageData = mainImage._data;
            const mainImagePath = `uploads/${mainImageFilename}`;

            await fs.writeFile(mainImagePath, mainImageData); 

            updateProduct.url = mainImagePath;
        }

        let imagePaths = [];
        if (images) {
            if (Array.isArray(images)) {
                for (let image of images) {
                    const filename = image.hapi.filename;
                    const data = image._data;
                    const path = `uploads/${filename}`;
                    await fs.writeFile(path, data);
                    imagePaths.push(path);
                }
            } else {
                const filename = images.hapi.filename;
                const data = images._data;
                const path = `uploads/${filename}`;
                await fs.writeFile(path, data);
                imagePaths.push(path);
            }

            updateProduct.images = imagePaths;
        }

        if (startDate) {
            const expiryDate = moment(startDate).add(7, "days").format("YYYY-MM-DD");
            updateProduct.expiryDate = expiryDate;
        }

       
        const updatedProduct = await updateProduct.save();

        return jsend(200, "Product updated successfully", updatedProduct);
    } catch (e) {
        console.error(e);
        return jsend(400, "Internal Server Error");
    }
}

// find particular user
async findOneProduct(req, res) {
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

      let userLogIndetails = await Product.findOne({ _id: req.query.productId });

      if (findUser) {
        return jsend(
          200,
          "Successfully fetched particular product details",
          userLogIndetails
        );
      } else {
        return jsend(400, "Failed to fetch the product details");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // find All user
  async findAllProduct(req, res) {
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
  
      let findProduct = await Product.find({});
      if (findProduct) {
        return jsend(
          200,
          "Successfully fetched the product details",
          findProduct
        );
      } else {
        return jsend(400, "Failed to fetch the product details");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }


  async deleteProduct(req, res) {
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
      let deleteUserDetails = await Product.findOne({ _id: req.query.productId});
      if (deleteUserDetails) {
        let deleteUserDetailss = await Product.deleteOne({ _id: req.query.productId});
        return jsend(200, "product details deleted successfully");
      } else {
        return jsend(400, "Failed to delete the product details");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  async getPaginatedProducts(req, res) {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;
    
    try {
      const query = search ? { name: { $regex: search, $options: 'i' } } : {};
  
      const products = await Product.find(query)
        .skip(skip)
        .limit(Number(limit))
        .populate('vendor', 'name email');
  
      const totalProducts = await Product.countDocuments(query);
      
      const response = [];
      for (let product of products) {
        const oldPrice = product.oldPrice;
        const price = product.price;
        
        if (oldPrice === undefined || price === undefined || isNaN(oldPrice) || isNaN(price)) {
          console.error('Invalid price data for product:', product);
          continue;  
        }
  
        const discountAmount = (oldPrice - price).toFixed(2);
        const discountPercentage = ((discountAmount / oldPrice) * 100).toFixed(2);
        
        response.push({
          ...product.toObject(),
          discountAmount,
          discountPercentage,
          vendor: product.vendor,
        });
      }
  
      return jsend(200, 'Products fetched successfully', {
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: Number(page),
        products: response,
      });
    } catch (err) {
      // Log error for debugging
      console.error('Error occurred:', err);
      return jsend(err, 500, 'Internal Server Error');
    }
  }
  
}

module.exports = ProductModule;
