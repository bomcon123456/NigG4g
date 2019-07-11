import { utilApi } from "../api/common/util-api";

const getMetaTags = url => {
  return utilApi
    .getMetaTags(url)
    .then(data => {
      if (data.status === 200) {
        return data.data;
      } else {
        const error = new Error("scrapper_failed");
        error.statusCode = 400;
        throw error;
      }
    })
    .catch(err => {
      throw err;
    });
};

export { getMetaTags };
