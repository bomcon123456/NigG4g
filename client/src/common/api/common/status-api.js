import { axiosApi } from "../api";

export const statusApi = {
  getAll() {
    return axiosApi.get("/status");
  },
  get(staId) {
    return axiosApi.get("/status/" + staId);
  }
};
