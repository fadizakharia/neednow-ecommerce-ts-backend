import { ObjectType, Field } from "type-graphql";
import { FieldError } from "../../../util/FieldError";
import { Store } from "../../../Entity/Store";

@ObjectType()
export class StoreResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Store, { nullable: true })
  store?: Store;
}
