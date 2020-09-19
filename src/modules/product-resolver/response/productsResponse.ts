import { ObjectType, Field } from "type-graphql";
import { FieldError } from "../../../util/FieldError";
import { Store } from "../../../Entity/Store";
import { Product } from "../../../Entity/Product";

@ObjectType()
export class ProductsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Store, { nullable: true })
  products?: Array<Product>;
}
