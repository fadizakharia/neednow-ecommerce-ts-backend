import * as yup from "yup";
export const deleteFromCartSchema = yup.object().shape({
  itemProductId: yup.number().integer().min(1),
});
