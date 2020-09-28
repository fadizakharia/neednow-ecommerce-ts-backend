import * as yup from "yup";
import { countryNames } from "../../../util/country";

export const addAddressSchema = yup.object().shape({
  longitude: yup.number().min(-180).max(180),

  latitude: yup.number().min(-90).max(90),

  country: yup.string().oneOf(countryNames),

  state: yup.string().optional().min(1),

  city: yup.string().min(1),

  address_line_1: yup.string().min(1),

  address_line_2: yup.string().optional().min(1),

  postalCode: yup.string().optional().min(1),
});
