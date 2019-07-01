import { authenCache } from "../cache/authen-cache";
import { axiosApi } from "../api/api";

export const authenLoader = {
  init() {
    axiosApi.addHeader("Authorization", () => {
      let token = authenCache.getAuthen();
      return token ? `Bearer ${token}` : null;
    });

    return authenCache
      .loadAuthen()
      .then(() => Promise.resolve())
      .catch(error => Promise.resolve());
  }
};
