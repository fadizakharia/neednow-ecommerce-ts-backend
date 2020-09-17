import { Store } from "../../Entity/Store";
import { User } from "../../Entity/User";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../types/context";
import { AddStoreInput } from "./addstore/addstore-input";
import { StoreResponse } from "./response/StoreResponse";
import { getRepository } from "typeorm";
import { storeSchema } from "./addstore/addstore-validation-schema";
import { ValidationError } from "yup";
import { StoresResponse } from "./response/StoresResponse";
@Resolver()
export class StoreResolver {
  @Query(() => StoreResponse)
  async getStore(@Arg("storeId") storeId: string): Promise<StoreResponse> {
    const storeRepository = getRepository(Store);
    const store = await storeRepository.findOne({
      where: { id: storeId },
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
}
