import { ObjectType, Field } from "type-graphql";
import { User } from "../../../Entity/User";
import { FieldError } from "../../../util/FieldError";

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}
