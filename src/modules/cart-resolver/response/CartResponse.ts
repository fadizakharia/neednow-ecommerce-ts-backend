import { Field, ObjectType } from "type-graphql";
import { Cart } from "../../../Entity/Cart";
import { FieldError } from "../../../util/FieldError";

@ObjectType()
export class CartResponse {
  @Field(() => Cart, { nullable: true })
  cart?: Cart;
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
