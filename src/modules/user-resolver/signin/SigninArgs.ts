import { InputType, Field } from "type-graphql";
import { Length, IsEmail } from "class-validator";

@InputType()
export class SigninInput {
  @Field()
  @IsEmail()
  email: string;
  @Field()
  @Length(8, 26)
  password: string;
}
