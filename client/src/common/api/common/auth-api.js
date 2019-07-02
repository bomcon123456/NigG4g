import { axiosApi } from "../api";

export const authApi = {
  post(data) {
    return axiosApi.post("/auth", data);
  },
  get() {
    return axiosApi.get("/auth");
  }
};
