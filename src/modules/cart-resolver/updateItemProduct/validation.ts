import * as yup from "yup";
export const updateItemProductSchema = yup.object().shape({
  itemProductId: yup.number().integer().positive(),
  quantity: yup.number().integer().min(1),
});
