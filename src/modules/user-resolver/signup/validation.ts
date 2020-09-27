import * as yup from "yup";
export const registrationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("first name is required")
    .max(255, "first name is too long"),
  lastName: yup
    .string()
    .required("last name is required")
    .max(255, "last name is too long"),
  age: yup.number().required().min(13),

  email: yup
    .string()
    .email("please enter a valid a email")
    .required("email is required")
    .max(255, "max length of 255 reached on email"),
  password: yup
    .string()
    .required("password is required")
    .min(8, "password must be a minimum length of 8 characters")
    .max(128, "password must be a maximum length of 128 characters"),
});
