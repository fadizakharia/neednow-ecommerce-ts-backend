import * as yup from "yup";
import { countryNames } from "../../../util/country";

export const updateStoreAddressSchema = yup.object().shape({
  storeId: yup.number().min(1),

  longitude: yup
    .string()
    .optional()
    .matches(
      /^(\+|-)?((\d((\.)|\.\d{1,6})?)|(0*?\d\d((\.)|\.\d{1,6})?)|(0*?1[0-7]\d((\.)|\.\d{1,6})?)|(0*?180((\.)|\.0{1,6})?))$/,
      "invalid longitude value"
    ),

  latitude: yup
    .string()
    .optional()
    .matches(
      /^(\+|-)?((\d((\.)|\.\d{1,6})?)|(0*?[0-8]\d((\.)|\.\d{1,6})?)|(0*?90((\.)|\.0{1,6})?))$/,
      "invalid latitude value"
    ),

  country: yup.string().optional().oneOf(countryNames),

  state: yup.string().optional().min(1),

  city: yup.string().optional().min(1),

  address_line_1: yup.string().optional().min(1),

  address_line_2: yup.string().optional().min(1),

  postalCode: yup.string().optional().min(1),

  range: yup.number().optional().min(0),
});
