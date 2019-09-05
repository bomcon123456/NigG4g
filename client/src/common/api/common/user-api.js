import { axiosApi } from "../api";

export const userApi = {
  get(userId) {
    return axiosApi.get("/users/" + userId);
  },
  post(data) {
    return axiosApi.post("/users", data);
  },
  put(userId, data) {
    return axiosApi.put("/users/" + userId, data);
  },
  delete(userId) {
    return axiosApi.delete("/users/" + userId);
  },
  checkEmail(data) {
    return axiosApi.post("/users/check-email", data);
  },
  checkUsername(data) {
    return axiosApi.post("users/check-username", data);
  },
  postForgotPassword(data) {
    return axiosApi.post("/users/forgot-password", data);
  },
  postUpdatePassword(data) {
    return axiosApi.post("/users/update-password", data);
  },
  getVerifyUser(token) {
    return axiosApi.get("/users/verify/" + token);
  },
  putChangePassword(data) {
    return axiosApi.put("/users/change-password", data);
  },
  updateAccount(data) {
    return axiosApi.put("users/update-account", data);
  },
  updateProfile(data) {
    return axiosApi.put("users/update-profile", data);
  }
};
