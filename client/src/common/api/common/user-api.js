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
  }
};
