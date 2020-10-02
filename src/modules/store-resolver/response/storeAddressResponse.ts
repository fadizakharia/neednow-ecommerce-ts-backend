import { ObjectType, Field } from "type-graphql";
import { FieldError } from "../../../util/FieldError";
import { StoreAddress } from "../../../Entity/StoreAddress";

@ObjectType()
export class StoreAddressResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => StoreAddress, { nullable: true })
  storeAddress?: StoreAddress;
}
