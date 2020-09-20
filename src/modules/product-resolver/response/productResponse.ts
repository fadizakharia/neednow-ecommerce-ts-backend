import { ObjectType, Field } from "type-graphql";
import { FieldError } from "../../../util/FieldError";

import { Product } from "../../../Entity/Product";

@ObjectType()
export class ProductResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Product, { nullable: true })
  product?: Product;
}
