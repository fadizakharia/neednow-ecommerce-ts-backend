import * as yup from "yup";
export const AddToCartValidation = yup.object().shape({
  productId: yup.number().integer().min(1),
  quantity: yup.number().integer().min(0),
});
