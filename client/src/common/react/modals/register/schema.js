import * as yup from "yup";

export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username must be at least 3-char long.")
    .max(50, "Username should not have more than 50 characters")
    .required("Username must not be empty"),
  email: yup
    .string()
    .email("Please input a valid email.")
    .required("Email must not be empty"),
  password: yup
    .string()
    .min(6, "Password must be at least 6-char long.")
    .required("Password must not be empty")
});
