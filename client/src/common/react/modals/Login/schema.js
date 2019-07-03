import * as yup from "yup";

export const accountSchema = yup.object().shape({
  email: yup
    .string()
    .email("Nhập email")
    .min(6, "Tên đăng nhập lớn hơn 6 kí tự")
    .max(20, "Tên đăng nhập nhỏ hơn 20 kí tự"),
  password: yup.string().min(6, "Mật khẩu bắt buộc từ 6 ký tự trở lên")
});
