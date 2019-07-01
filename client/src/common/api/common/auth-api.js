import { axiosApi } from "../api";

export const authApi = {
  post(data) {
    return axiosApi.post("/auth", data);
  },
  get() {
    console.log("asdsad");

    return axiosApi.get("/auth");
  }
};
