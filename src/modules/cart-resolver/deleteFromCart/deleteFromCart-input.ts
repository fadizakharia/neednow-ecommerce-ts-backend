import { Field, InputType } from "type-graphql";

@InputType()
export class DeleteFromCartInput {
  @Field(() => Number)
  itemProductId: number;
}
