const Category = require("./model");
const Post = require("../posts/model");

const getCategories = (req, res, next) => {
  return Category.find()
    .then(data => {
      res.status(200).json({
        message: "Categories list",
        data: data
      });
      return data;
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};

const getCategory = (req, res, next) => {
  const catId = req.params.categoryId;
  return Category.findById(catId)
    .then(data => {
      res.status(200).json({
        message: "Category's get successfully",
        data: data
      });
      return data;
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};

const getPostFromCategory = (req, res, next) => {
  const catId = req.params.categoryId;
  return Post.find({ categoryId: catId })
    .then(data => {
      res.status(200).json({
        message: "Category's get successfully",
        data: data
      });
      return data;
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};

module.exports = {
  getCategories,
  getCategory,
  getPostFromCategory
};
