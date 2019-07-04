import * as yup from "yup";

export const accountSchema = yup.object().shape({
  email: yup.string().email("Please input a valid email."),
  password: yup.string().min(6, "Password must be at least 6-char long.")
});
