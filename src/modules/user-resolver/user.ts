import { Resolver, Mutation, Arg, Ctx, Query } from "type-graphql";
import { RegInput } from "./signup/signup-input";
import { SigninInput } from "./signin/SigninArgs";
import { Context } from "../types/context";
import { UserResponse } from "./signup/signup-response";
import Argon from "argon2";
import { getRepository } from "typeorm";
import { User } from "../../Entity/User";
import { Cart } from "../../Entity/Cart";
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
    const emailAlreadyExists = await getRepository(User).findOne({
      where: { email: data.email },
    });

    if (emailAlreadyExists !== undefined) {
      return { errors: [{ field: "Email", message: "User Already Exists!" }] };
    }

    const userRepository = await getRepository(User);
    const cartRepository = await getRepository(Cart);
    const password = await Argon.hash(data.password);
    const createdUser = await userRepository.create({ ...data, password });
    const cartForUser = await cartRepository.create({
      user: Promise.resolve(createdUser),
    });

    const savedUser = await userRepository.save(createdUser);
    await cartRepository.save(cartForUser);
    createdUser.cart = Promise.resolve(cartForUser);
    ctx.req.session!.userId = createdUser.id;

    return { user: savedUser };
  }
  @Mutation(() => UserResponse)
  async signin(
    @Arg("data") data: SigninInput,
    @Ctx() context: Context
  ): Promise<UserResponse> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email: data.email } });
    if (!user) {
      return {
        errors: [{ field: "signin", message: "username or password mismatch" }],
      };
    }
    const valid = await Argon.verify(user.password, data.password);
    if (!valid) {
      return {
        errors: [{ field: "signin", message: "username or password mismatch" }],
      };
    }
    context.req.session!.id = user.id.toString();
    return { user: user };
  }
}
