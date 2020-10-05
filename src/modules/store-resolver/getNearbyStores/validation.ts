import * as yup from "yup";
import { countryNames } from "../../../util/country";
import { productCategories, storeTypes } from "../../../util/storetypes";
export const GetNearbyStoresSchema = yup.object().shape({
  longitude: yup.number().min(-90).max(90),
  latitude: yup.number().min(-180).max(180),
  country: yup.string().oneOf(countryNames),
  page: yup.number().integer().min(0),
  type: yup.string().optional().oneOf(storeTypes),
  category: yup.string().optional().oneOf(productCategories),
});
