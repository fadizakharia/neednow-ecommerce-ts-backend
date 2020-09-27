import * as yup from "yup";
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("please enter a valid a email")
    .required("email is required")
    .max(255, "max length reaced on email"),
  password: yup
    .string()
    .required("password is required")
    .min(8, "password must be a minimum length of 8 characters")
    .max(128, "password must be a maximum length of 128 characters"),
});
