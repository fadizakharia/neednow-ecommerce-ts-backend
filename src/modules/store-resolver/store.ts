import { Store } from "../../Entity/Store";
import { User } from "../../Entity/User";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../types/context";
import { AddStoreInput } from "./addstore/input";
import { StoreResponse } from "./response/StoreResponse";
import { getRepository } from "typeorm";
import { storeSchema } from "./addstore/validation";
import { ValidationError } from "yup";
import { StoresResponse } from "./response/StoresResponse";
import { AddStoreAddressInput } from "./addStoreAddress/input";
import { addStoreAddressSchema } from "./addStoreAddress/validation";
import { StoreAddressResponse } from "./response/storeAddressResponse";
import { StoreAddress } from "../../Entity/StoreAddress";
import { updateStoreAddressInput } from "./updateStoreAddress/input";
import { updateStoreAddressSchema } from "./updateStoreAddress/validation";
@Resolver()
export class StoreResolver {
  @Query(() => StoreResponse)
  async getStore(@Arg("storeId") storeId: number): Promise<StoreResponse> {
    const storeRepository = getRepository(Store);
    const store = await storeRepository.findOne({
      where: { id: storeId },
      relations: ["user", "product"],
    });
    if (!store) {
      return { errors: [{ field: "store", message: "store does not exist!" }] };
    }
    return { store };
  }
  @Query(() => StoresResponse)
  async getStores(@Arg("userId") userId: string): Promise<StoresResponse> {
    const store = getRepository(Store);
    const user = getRepository(User);
    const seller = user.findOne({ where: { id: userId } });
    const stores = await store.find({ where: { user: seller } });
    if (!(await seller)) {
      return { error: { field: "id", message: "seller does not exist!" } };
    }
    if (stores.length === 0) {
      return {
        error: { field: "stores", message: "seller does not have any stores!" },
      };
    }
    return { stores: stores };
  }
  @Authorized()
  @Mutation(() => StoreResponse)
  async addStore(
    @Arg("args") args: AddStoreInput,
    @Ctx() context: Context
  ): Promise<StoreResponse> {
    const userId = context.req.session!.userId;
    // console.log(userId);

    const error: { field: string; message: string }[] = [];
    await storeSchema
      .validate({ ...args }, { abortEarly: false })
      .catch(function (err: ValidationError) {
        err.inner.forEach((e: any) => {
          error.push({ field: e.path, message: e!.message });
        });
      });
    if (error.length > 0) {
      return { errors: error };
    }
    const store = getRepository(Store);
    const user = getRepository(User);
    // const allUsers = await user.find();
    // console.log(allUsers.length);

    const seller = await user.findOne({ where: { id: userId } });
    // console.log(seller);
    if (seller) {
      const createdStore = store.create({
        ...args,
        user: seller,
      });
      seller.store = [createdStore];
      await user.save(seller);
      await store.save(createdStore);
      return { store: createdStore };
    } else {
      return {
        errors: [{ field: "system error", message: "Something went wrong!" }],
      };
    }
  }
  @Authorized()
  @Mutation(() => StoreAddressResponse)
  async addStoreAddress(
    @Ctx() ctx: Context,
    @Arg("args") args: AddStoreAddressInput
  ): Promise<StoreAddressResponse> {
    const userId = ctx.req.session!.userId;

    const error: { field: string; message: string }[] = [];
    await addStoreAddressSchema
      .validate({ ...args }, { abortEarly: false })
      .catch(function (err: ValidationError) {
        err.inner.forEach((e: any) => {
          error.push({ field: e.path, message: e!.message });
        });
      });
    if (error.length > 0) {
      return { errors: error };
    }
    const store = getRepository(Store);
    const currentStore = await store.findOne({
      where: { id: args.storeId },
      relations: ["user"],
    });
    if (!currentStore) {
      return { errors: [{ field: "store", message: "store does not exist" }] };
    }
    if (currentStore!.user.id !== userId) {
      return {
        errors: [
          {
            field: "authorization",
            message: "you are not authorized to access this store",
          },
        ],
      };
    }
    const storeAddress = getRepository(StoreAddress);
    const createdStore = storeAddress.create({ ...args });
    createdStore.store = currentStore;
    const savedAddress = await storeAddress.save(createdStore);
    return { storeAddress: savedAddress };
  }
  @Authorized()
  @Mutation(() => StoreAddressResponse)
  async updateStoreAddress(
    @Ctx() ctx: Context,
    @Arg("args") args: updateStoreAddressInput
  ): Promise<StoreAddressResponse> {
    const userId = ctx.req.session!.userId;

    const error: { field: string; message: string }[] = [];
    await updateStoreAddressSchema
      .validate({ ...args }, { abortEarly: false })
      .catch(function (err: ValidationError) {
        err.inner.forEach((e: any) => {
          error.push({ field: e.path, message: e!.message });
        });
      });
    if (error.length > 0) {
      return { errors: error };
    }
    const store = getRepository(Store);
    const currentStore = await store.findOne({
      where: { id: args.storeId },
      relations: ["user", "address"],
    });
    if (!currentStore) {
      return { errors: [{ field: "store", message: "store does not exist" }] };
    }
    if (currentStore!.user.id !== userId) {
      return {
        errors: [
          {
            field: "authorization",
            message: "you are not authorized to access this store",
          },
        ],
      };
    }
    const { storeId, ...updateArguements } = args;
    const storeAddress = getRepository(StoreAddress);
    await storeAddress.update(currentStore.address.id, { ...updateArguements });
    const updatedStoreAddress = await storeAddress.findOne({
      where: { id: currentStore.address.id },
    });
    return { storeAddress: updatedStoreAddress };
  }
  @Authorized()
  @Mutation(() => Boolean)
  async deleteStore(
    @Ctx() ctx: Context,
    @Arg("storeId") storeId: number
  ): Promise<boolean> {
    const userId = ctx.req.session!.userId;
    const storeRepository = getRepository(Store);
    const storeAddress = getRepository(StoreAddress);
    const store = await storeRepository.findOne({
      where: { id: storeId },
      relations: ["user"],
    });
    if (store) {
      if (store.user.id === userId) {
        const currentStoreAddress = await storeAddress.findOne({
          where: { store: store },
        });
        if (currentStoreAddress) await storeAddress.delete(currentStoreAddress);
        await storeRepository.delete(store);
        return true;
      }
    }
    return false;
  }
}
