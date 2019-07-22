import { axiosApi } from "../api";

export const utilApi = {
  checkImageSize(url) {
    return axiosApi.post("/util/image-size", { url: url });
  },
  checkImageFile(data) {
    return axiosApi.post("/util/image-size", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  getCommentPreview(data) {
    return axiosApi.post("/util/comment-preview", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  getMetaTags(url) {
    return axiosApi.post("/util/get-url", { url: url });
  }
};
