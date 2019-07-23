import { createApiCache } from "./api-cache";
import { categoryApi } from "../../api/common/category-api";
import { countryApi } from "../../api/common/country-api";
import { statusApi } from "../../api/common/status-api";

export const categoryCache = createApiCache(() =>
  categoryApi.getAll().then(response => {
    if (response.status === 200) {
      return response.data ? response.data.data : response.data;
    } else {
      return [];
    }
  })
);

export const statusCache = createApiCache(() =>
  statusApi.getAll().then(response => {
    if (response.status === 200) {
      return response.data ? response.data.data : response.data;
    } else {
      return [];
    }
  })
);

export const countryCache = createApiCache(() =>
  countryApi.getAll().then(response => {
    if (response.status === 200) {
      return response.data ? response.data.data : response.data;
    } else {
      return [];
    }
  })
);

export const initClientCache = () => {
  return Promise.all([
    categoryCache.get(),
    countryCache.get(),
    statusCache.get()
  ]);
};
