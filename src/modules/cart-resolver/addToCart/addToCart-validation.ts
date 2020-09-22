import * as yup from "yup";
export const AddToCartValidation = yup.object().shape({
  productId: yup.number().min(1).positive(),
  quantity: yup.number().min(1).positive(),
});
