import { ObjectType, Field } from "type-graphql";
import { UserAddress } from "../../../Entity/UserAddress";
import { FieldError } from "../../../util/FieldError";

@ObjectType()
export class UserAddressResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [UserAddress], { nullable: true })
  addresses?: UserAddress[];
  @Field(() => UserAddress, { nullable: true })
  address?: UserAddress;
}
