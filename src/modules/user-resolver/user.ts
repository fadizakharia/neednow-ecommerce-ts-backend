import { Resolver, Mutation, Arg, Ctx, Query } from "type-graphql";
import { RegInput } from "./signup/signup-input";
import { SigninInput } from "./signin/SigninArgs";
import { Context } from "../types/context";
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
  @Mutation(() => User)
  async signup(
    @Arg("data", () => RegInput) data: RegInput,
    @Ctx() ctx: Context
  ): Promise<User> {
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

    return savedUser;
  }
  @Mutation(() => User)
  async signin(
    @Arg("data") data: SigninInput,
    @Ctx() context: Context
  ): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email: data.email } });

    context.req.session!.id = user!.id.toString();
    return user!;
  }
}
