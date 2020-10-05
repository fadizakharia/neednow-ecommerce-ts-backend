import * as yup from "yup";
import { productCategories, storeTypes } from "../../../util/storetypes";
export const storeSchema = yup.object().shape({
  storeName: yup
    .string()
    .min(5, "store name is too short")
    .max(255, "store name is too long"),
  storeDescription: yup
    .string()
    .min(10, "store description must be atleast 10 characters")
    .max(255, "store description is too long"),
  type: yup.string().oneOf(storeTypes),
  category: yup.array().of(yup.string().oneOf(productCategories)),
});
