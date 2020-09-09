import { InputType, Field } from "type-graphql";
import { Length, IsEmail, Validate } from "class-validator";
import { ValidateLogin } from "./ValidateLogin";

@InputType()
export class SigninInput {
  @Field()
  @IsEmail()
  email: string;
  @Field()
  @Length(8, 26)
  @Validate(ValidateLogin, { message: "username or password is incorrect" })
  password: string;
}
