import { Store } from "../../../Entity/Store";
import { Field, InputType } from "type-graphql";

@InputType()
export class AddStoreInput implements Partial<Store> {
  @Field()
  storeName: string;

  @Field()
  storeDescription: string;
  @Field()
  type: string;
  @Field(() => [String])
  category: string[];
}
