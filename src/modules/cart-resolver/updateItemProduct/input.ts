import { Field, InputType } from "type-graphql";

@InputType()
export class updateItemProductInput {
  @Field(() => Number)
  itemProductId: number;
  @Field(() => Number)
  quantity: number;
}
