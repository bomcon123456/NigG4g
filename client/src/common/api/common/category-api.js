import { axiosApi } from "../api";

export const categoryApi = {
  getAll() {
    return axiosApi.get("/categories");
  },
  get(catId) {
    return axiosApi.get("/categories/" + catId);
  }
};
