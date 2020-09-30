import { Resolver, Mutation, Arg, Ctx, Query, Authorized } from "type-graphql";
import { RegInput } from "./signup/input";
import { SigninInput } from "./signin/input";
import { AddAddressInput } from "./addAddress/input";
import { UpdateAddressSchema } from "./updateAddress/validation";
import { Context } from "../types/context";
import Argon from "argon2";
import { getRepository } from "typeorm";
import { User } from "../../Entity/User";
import { Cart } from "../../Entity/Cart";
import { UserResponse } from "./response/UserResponse";
import { loginSchema } from "./signin/validation";
import { registrationSchema } from "./signup/validation";
import { ValidationError } from "yup";
import { UserAddress } from "../../Entity/UserAddress";
import { addAddressSchema } from "./addAddress/validation";
import { updateAddressInput } from "./updateAddress/input";
import { UserAddressResponse } from "./response/AddressResponse";
@Resolver()
export class UserResolver {
  @Authorized()
  @Query(() => User)
  async currentUser(@Ctx() ctx: Context): Promise<User> {
    const userId = ctx.req.session!.userId;
    const user = getRepository(User);
    const currentUser = await user.findOne({ where: { id: userId } });
    return currentUser!;
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

    const savedUser = await userRepository.save(createdUser);
    const cartForUser = cartRepository.create({
      user: savedUser,
    });
    await cartRepository.save(cartForUser);
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
  @Mutation(() => UserAddressResponse)
  async addAddress(
    @Ctx() ctx: Context,
    @Arg("args") args: AddAddressInput
  ): Promise<UserAddressResponse> {
    const errors: { field: string; message: string }[] = [];
    await addAddressSchema
      .validate({ ...args }, { abortEarly: false })
      .catch(function (err: ValidationError) {
        err.inner.forEach((e: any) => {
          errors.push({ field: e.path, message: e!.message });
        });
      });

    if (errors.length > 0) {
      return { errors };
    }
    const userId = ctx.req.session!.userId;
    const user = getRepository(User);
    const address = getRepository(UserAddress);
    const currentUser = await user.findOne({ where: { id: userId } });
    const userAddress = address.create({ ...args });
    userAddress.user = currentUser!;
    const savedAddress = await address.save(userAddress);
    const addedAddress = (await address.findOne({
      where: { id: savedAddress.id },
      relations: ["user"],
    })) as UserAddress;
    return { address: addedAddress };
  }

  @Authorized()
  @Query(() => UserAddressResponse)
  async getAddresses(@Ctx() ctx: Context): Promise<UserAddressResponse> {
    const userId = ctx.req.session!.userId;
    const user = getRepository(User);
    const currentUser = await user.findOne({
      where: { id: userId },
      relations: ["address", "address.user"],
    });
    return { addresses: currentUser!.address };
  }

  @Authorized()
  @Mutation(() => UserAddressResponse)
  async deleteAddress(
    @Ctx() ctx: Context,
    @Arg("addressId") addressId: number
  ): Promise<UserAddressResponse> {
    if (addressId < 1) {
      return {
        errors: [{ field: "addressId", message: "addressId is invalid" }],
      };
    }
    const userId = ctx.req.session!.userId;
    const user = getRepository(User);
    const address = getRepository(UserAddress);
    const currentAddress = await address.findOne({
      where: { id: addressId },
      relations: ["user"],
    });

    if (!currentAddress) {
      return {
        errors: [{ field: "address", message: "address does not exist!" }],
      };
    }
    if (currentAddress.user.id !== userId) {
      return {
        errors: [
          {
            field: "authorization",
            message: "you are unauthorized to perfrom this task",
          },
        ],
      };
    }
    await address.delete(currentAddress);
    const currentUser = await user.findOne({
      where: { id: userId },
      relations: ["address", "address.user"],
    });
    return { addresses: currentUser!.address };
  }
  @Authorized()
  @Mutation(() => UserAddressResponse)
  async updateAddress(
    @Ctx() ctx: Context,
    @Arg("args") args: updateAddressInput
  ): Promise<UserAddressResponse> {
    const errors: { field: string; message: string }[] = [];
    await UpdateAddressSchema.validate(
      { ...args },
      { abortEarly: false }
    ).catch(function (err: ValidationError) {
      err.inner.forEach((e: any) => {
        errors.push({ field: e.path, message: e!.message });
      });
    });

    if (errors.length > 0) {
      return { errors };
    }
    let partialAddress = {};
    for (const [key, value] of Object.entries(args)) {
      if (value && key != "addressId") {
        partialAddress = { ...partialAddress, [key]: value };
      }
    }

    const userId = ctx.req.session!.userId;
    const address = getRepository(UserAddress);
    const currentAddress = await address.findOne({
      where: { id: args.addressId },
      relations: ["user"],
    });
    if (!currentAddress) {
      return {
        errors: [{ field: "address", message: "address does not exist" }],
      };
    }
    if (currentAddress.user.id !== userId) {
      return {
        errors: [
          {
            field: "authorization",
            message: "you are unauthorized to perfrom this task",
          },
        ],
      };
    }

    await address.update(
      { id: args.addressId },
      { id: args.addressId, ...partialAddress }
    );
    const updatedAddress = await address.findOne({
      where: { id: args.addressId },
      relations: ["user"],
    });
    return { address: updatedAddress };
  }

  @Authorized()
  @Mutation()
  logout(@Ctx() context: Context): boolean {
    if (!context.req.session?.destroy) {
      context.req.session!.userId = undefined;
    } else {
      context.req.session.destroy((err) => {
        if (err) {
          throw err;
        }
      });
    }

    if (context.req.session?.userId) {
      return false;
    } else {
      return true;
    }
  }
}
