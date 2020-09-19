import * as yup from "yup";
export const addProductSchema = yup.object().shape({
  name: yup.string().min(6).max(55),
  price: yup.number().min(0),
  description: yup.string().min(10),
  storeId: yup.number().positive(),
});
