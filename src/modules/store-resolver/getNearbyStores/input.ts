import { Field, InputType } from "type-graphql";

@InputType()
export class getNearbyStoresInput {
  @Field(() => Number)
  latitude: number;
  @Field(() => Number)
  longitude: number;
  @Field(() => String)
  country: string;
  @Field(() => Number, { defaultValue: 0 })
  page?: number;
  @Field(() => String, { nullable: true })
  type?: string;
  @Field(() => String, { nullable: true })
  category?: string;
}
