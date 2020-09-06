import { InputType, Field } from "type-graphql";
import { User } from "../../../Entity/User";
import { IsEmail, Length, Min } from "class-validator";

@InputType()
export class RegInput implements Partial<User> {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Number)
  @Min(13)
  age: number;

  @Field(() => String)
  @Length(8, 26)
  password: string;
}
