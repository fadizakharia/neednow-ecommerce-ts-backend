import { Field, ID, InputType } from "type-graphql";

@InputType()
export class updateStoreAddressInput {
  @Field(() => ID)
  storeId: number;

  @Field(() => Number, { nullable: true })
  longitude?: number;

  @Field(() => Number, { nullable: true })
  latitude?: number;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  address_line_1?: string;

  @Field(() => String, { nullable: true })
  address_line_2?: string;

  @Field(() => String, { nullable: true })
  postalCode?: string;

  @Field(() => Number, { nullable: true })
  range?: number;
}
