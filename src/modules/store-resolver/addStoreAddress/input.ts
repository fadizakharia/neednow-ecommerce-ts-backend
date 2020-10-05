import { Field, ID, InputType } from "type-graphql";

@InputType()
export class AddStoreAddressInput {
  @Field(() => ID)
  storeId: number;

  @Field(() => Number)
  longitude: number;

  @Field(() => Number)
  latitude: number;

  @Field(() => String)
  country: string;

  @Field(() => String, { nullable: true })
  state: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  address_line_1: string;

  @Field(() => String, { nullable: true })
  address_line_2: string;

  @Field(() => String, { nullable: true })
  postalCode: string;

  @Field(() => Number)
  range: number;
}
