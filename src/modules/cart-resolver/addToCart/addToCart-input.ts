import { Field, InputType } from "type-graphql";

@InputType()
export class AddToCartInput {
  @Field(() => Number)
  productId: number;
  @Field(() => Number)
  quantity: number;
}
