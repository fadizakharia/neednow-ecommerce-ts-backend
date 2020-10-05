import * as yup from "yup";
import { countryNames } from "../../../util/country";

export const UpdateAddressSchema = yup.object().shape({
  addressId: yup.number().integer().min(1),

  longitude: yup.number().optional().min(-90).max(90),

  latitude: yup.number().optional().min(-180).max(180),

  country: yup.string().optional().oneOf(countryNames),

  state: yup.string().optional().min(1),

  city: yup.string().optional().min(1),

  address_line_1: yup.string().optional().min(1),

  address_line_2: yup.string().optional().min(1),

  postalCode: yup.string().optional().min(1),
});
