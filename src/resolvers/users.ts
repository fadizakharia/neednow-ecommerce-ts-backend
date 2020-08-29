import {
  Resolver,
  Query,
  ObjectType,
  Field,
  Mutation,
  InputType,
  Arg,
} from "type-graphql";
import { User } from "../Entity/users";
import Argon from "argon2";
@InputType()
// class LoginInput {
//   @Field()
//   username: string;
//   @Field()
//   password: string;
// }
class RegisterInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Number)
  age: number;

  @Field(() => String)
  password: string;

  @Field(() => Number)
  zipcode: number;

  @Field(() => String)
  state: string;

  @Field(() => String)
  address_line_1: string;

  @Field(() => String, { nullable: true })
  address_line_2?: string;

  @Field(() => String, { nullable: true })
  profile_picture_uri?: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}
@ObjectType()
class AllUserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [User], { nullable: true })
  user?: User[];
}

@Resolver()
export class Users {
  @Query(() => AllUserResponse)
  async users(): Promise<AllUserResponse> {
    const users = await User.find();
    console.log(users);

    if (users.length > 0) {
      return { user: users };
    } else {
      return {
        errors: [{ field: "all users", message: "could not find any users" }],
      };
    }
  }
  // @Query(() => UserResponse)
  // async login(): Promise<UserResponse> {
  //   const users = await User.find();
  // }
  @Mutation(() => UserResponse)
  async signup(@Arg("regData") data: RegisterInput): Promise<UserResponse> {
    const hashPassword = await Argon.hash(data.password);
    const user = User.create({ ...data, password: hashPassword });
    try {
      await user.save();
      return { user };
    } catch (err) {
      console.log(err);

      return {
        errors: [{ field: "registration error", message: "cannot save user" }],
      };
    }
  }
}
