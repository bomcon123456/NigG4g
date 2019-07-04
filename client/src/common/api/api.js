import axios from "axios";
import { authenCache } from "../cache/authen-cache";

class API {
  constructor({ url, onErrors }) {
    this.instance = axios.create({
      baseURL: url
    });
    this.headers = {};
    this.instance.interceptors.request.use(request => {
      Object.keys(this.headers).map(key => {
        let val =
          typeof this.headers[key] === "function"
            ? this.headers[key]()
            : this.headers[key];
        if (val) {
          request.headers[key] = val;
        }
        return key;
      });
      return request;
    });
    this.instance.interceptors.response.use(
      response => {
        // console.log(response);
        return response;
      },
      error => {
        if (
          error.response &&
          onErrors.hasOwnProperty(error.response.data.message)
        ) {
          onErrors[error.response.data.message]();
        } else {
          // console.log(error);
        }
        return Promise.reject(error);
      }
    );
  }

  addHeader = (key, getHeader) => {
    this.headers[key] = getHeader;
  };

  get = (url, config = null) => {
    return this.instance.get(url, config);
  };

  delete = (url, config = null) => {
    return this.instance.delete(url, config);
  };

  post = (url, data, config) => {
    return this.instance.post(url, data, config);
  };

  put = (url, data, config) => {
    return this.instance.put(url, data, config);
  };
}

export const axiosApi = new API({
  url: "http://localhost:6969/api",
  onErrors: {
    token_expired: () => {
      console.log("token_expired");
      authenCache.clearAuthen();
    },
    account_not_found: () => {
      console.log("account_not_found");
      authenCache.clearAuthen();
    },
    require_login: () => {
      console.log("require_login");
      authenCache.clearAuthen();
    }
  }
});
