import { Field, ID, InputType } from "type-graphql";

@InputType()
export class AddProductInput {
  @Field(() => String)
  name: string;

  @Field(() => Number)
  price: number;

  @Field(() => String)
  description: string;

  @Field(() => ID)
  storeId: number;
}
