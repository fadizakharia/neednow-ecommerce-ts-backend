import { InputType, Field } from "type-graphql";
import { User } from "../../../Entity/User";
import { IsEmail, Length, Min, Validate } from "class-validator";
import { EmailExists } from "./EmailExistCheck";

@InputType()
export class RegInput implements Partial<User> {
  @Field(() => String)
  @IsEmail()
  @Validate(EmailExists, { message: "Email Already Exists!" })
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
