import { Resolver, Mutation, Arg, Ctx, Query, Authorized } from "type-graphql";
import { RegInput } from "./signup/signup-input";
import { SigninInput } from "./signin/SigninArgs";
import { Context } from "../types/context";
import Argon from "argon2";
import { getRepository } from "typeorm";
import { User } from "../../Entity/User";
import { Cart } from "../../Entity/Cart";
import { UserResponse } from "./response/UserResponse";
import { loginSchema } from "./signin/signinValidatorSchema";
import { registrationSchema } from "./signup/signupValidatorSchema";
import { ValidationError } from "yup";
@Resolver()
export class UserResolver {
  @Query(() => String)
  helloworld() {
    return "hello";
  }
  @Mutation(() => UserResponse)
  async signup(
    @Arg("data", () => RegInput) data: RegInput,
    @Ctx() ctx: Context
  ): Promise<UserResponse> {
    const error: { field: string; message: string }[] = [];
    await registrationSchema
      .validate({ ...data }, { abortEarly: false })
      .catch(function (err: ValidationError) {
        err.inner.forEach((e: any) => {
          error.push({ field: e.path, message: e!.message });
        });
      });

    if (error.length > 0) {
      return { errors: error };
    }
    const userRepository = getRepository(User);
    const cartRepository = getRepository(Cart);
    const userExists = await userRepository.findOne({
      where: { email: data.email },
    });
    if (userExists) {
      return {
        errors: [{ field: "email", message: "account already exists!" }],
      };
    }
    const password = await Argon.hash(data.password);

    const createdUser = userRepository.create({ ...data, password });
    const cartForUser = cartRepository.create({
      user: createdUser,
    });

    const savedUser = await userRepository.save(createdUser);
    await cartRepository.save(cartForUser);
    createdUser.cart = cartForUser;
    ctx.req.session!.userId = createdUser.id;

    return { user: savedUser };
  }
  @Mutation(() => UserResponse)
  async signin(
    @Arg("data") data: SigninInput,
    @Ctx() context: Context
  ): Promise<UserResponse> {
    const error: { field: string; message: string }[] = [];
    await loginSchema
      .validate({ ...data }, { abortEarly: false })
      .catch(function (err: ValidationError) {
        err.inner.forEach((e: any) => {
          error.push({ field: e.path, message: e!.message });
        });
      });
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email: data.email } });
    if (!user) {
      return {
        errors: [
          { field: "email", message: "email or password are incorrect" },
          { field: "password", message: "email or password are incorrect" },
        ],
      };
    }
    const validPassword = await Argon.verify(user.password, data.password);
    if (!validPassword) {
      return {
        errors: [
          { field: "email", message: "email or password are incorrect" },
          { field: "password", message: "email or password are incorrect" },
        ],
      };
    }
    context.req.session!.userId = user!.id.toString();

    return { user };
  }
  @Authorized()
  @Mutation()
  logout(@Ctx() context: Context): boolean {
    context.req.session?.destroy((err) => {
      if (err) {
        throw err;
      }
    });
    if (context.req.session?.userId) {
      return false;
    } else {
      return true;
    }
  }
}
