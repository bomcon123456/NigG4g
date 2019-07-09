import { axiosApi } from "../api";

export const utilApi = {
  checkImageSize(url) {
    return axiosApi.get(`/util/image-size?url=${url}`);
  }
};
