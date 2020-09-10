import { InputType, Field } from "type-graphql";
import { User } from "../../../Entity/User";

@InputType()
export class RegInput implements Partial<User> {
  @Field(() => String)
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Number)
  age: number;

  @Field(() => String)
  password: string;
}
