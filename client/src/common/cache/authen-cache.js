import { Cache } from "./cache";
import Cookies from "js-cookie";
import omit from "lodash/omit";

import { authApi } from "../api/common/auth-api";
import { userInfo } from "../states/user-info";

const cookiesEngine = {
  getItem: Cookies.get,
  setItem: Cookies.set,
  removeItem: Cookies.remove
};

export const authenCache = (() => {
  const cache = new Cache(cookiesEngine);
  return {
    clearAuthen() {
      cache.set(null, "authen-token");
    },
    loadAuthen() {
      return new Promise((resolve, reject) => {
        let authen = cache.get("authen-token");
        if (!authen) {
          reject();
        } else {
          authApi
            .get()
            .then(info => {
              if (!info.data) {
                reject();
              } else {
                const user = omit(info.data, [
                  "password",
                  "createdAt",
                  "updatedAt",
                  "active"
                ]);
                userInfo.setState(user);
                resolve(userInfo.getState());
              }
            })
            .catch(error => reject());
        }
      });
    },
    getAuthen() {
      return cache.get("authen-token");
    },
    setAuthen(authen, options) {
      cache.set(authen, "authen-token", options);
    }
  };
})();
