import { authenCache } from "../cache/authen-cache";
import { axiosApi } from "../api/api";
import { asyncParallel } from "../utils/async-utils";
import { initClientCache } from "../cache/api-cache/common-cache";

export const authenLoader = {
  init() {
    axiosApi.addHeader("Authorization", () => {
      let token = authenCache.getAuthen();
      return token ? `Bearer ${token}` : null;
    });

    return asyncParallel([
      () => authenCache.loadAuthen(),
      () => initClientCache()
    ])
      .then(result => {
        console.log("[Async Parallel Init: ]", result);
        Promise.resolve(result);
      })
      .catch(error => Promise.resolve());
  }
};
