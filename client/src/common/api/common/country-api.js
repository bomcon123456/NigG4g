import { axiosApi } from "../api";

export const countryApi = {
  getAll() {
    return axiosApi.get("/countries");
  },
  get(countryId) {
    return axiosApi.get("/countries/" + countryId);
  }
};
