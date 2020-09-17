import { ObjectType, Field } from "type-graphql";
import { Store } from "../../../Entity/Store";
import { FieldError } from "../../../util/FieldError";
@ObjectType()
export class StoresResponse {
  @Field(() => [FieldError], { nullable: true })
  error?: FieldError;
  @Field(() => Store, { nullable: true })
  stores?: Store[];
}
