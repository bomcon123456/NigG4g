const Status = require("./model");

const getAll = (req, res, next) => {
  return Status.find()
    .then(data => {
      res.status(200).json({
        message: "status_fetched",
        data: data
      });
      return data;
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};

const get = (req, res, next) => {
  const statusId = req.params.statusId;
  return CategStatusory.findById(statusId)
    .then(data => {
      res.status(200).json({
        message: "status_fetched",
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
  getAll,
  get
};
