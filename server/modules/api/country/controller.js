const Country = require("./model");

const getCountries = (req, res, next) => {
  return Country.find()
    .then(data => {
      res.status(200).json({
        message: "fetched_countries",
        data: data
      });
      return data;
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};

const getCountry = (req, res, next) => {
  const counId = req.params.countryId;
  return Country.findById(counId)
    .then(data => {
      res.status(200).json({
        message: "fetched_country",
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
  getCountries,
  getCountry
};
