import { createApiCache } from "./api-cache";
import { categoryApi } from "../../api/common/category-api";

export const categoryCache = createApiCache(() =>
  categoryApi.getAll().then(response => {
    if (response.status === 200) {
      return response.data ? response.data.data : response.data;
    } else {
      return [];
    }
  })
);

export const initClientCache = () => {
  return Promise.all([categoryCache.get()]);
};
