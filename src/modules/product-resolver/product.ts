import { Product } from "../../Entity/Product";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { ProductResponse } from "./response/productResponse";
import { AddProductInput } from "./addProduct/addProduct-input";
import { Context } from "../types/context";
import { addProductSchema } from "./addProduct/addProduct-validation";
import { ValidationError } from "yup";
import { Store } from "../../Entity/Store";
import { ProductsResponse } from "./response/productsResponse";
@Resolver()
export class ProductResolver {
  @Query(() => ProductResponse)
  async getProduct(
    @Arg("productId") productId: string
  ): Promise<ProductResponse> {
    const product = getRepository(Product);
    const foundProduct = await product.findOne({ where: { id: productId } });
    if (!foundProduct) {
      return { errors: [{ field: "product", message: "product not found" }] };
    }
    return { product: foundProduct };
  }
  @Query(() => ProductsResponse)
  async getProducts(
    @Arg("productId") storeId: string
  ): Promise<ProductsResponse> {
    const store = getRepository(Store);
    const foundStore = await store.findOne({ where: { id: storeId } });
    if (!foundStore) {
      return { errors: [{ field: "store", message: "Store does not exist" }] };
    }
    return { products: foundStore.product };
  }
  @Authorized("authorized")
  @Mutation(() => ProductResponse)
  async addProduct(
    @Arg("args") args: AddProductInput,
    @Ctx() context: Context
  ): Promise<ProductResponse> {
    const userId = context.req.session!.userId;

    const error: { field: string; message: string }[] = [];
    await addProductSchema
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
    const foundStore = await store.findOne({
      where: { id: args.storeId },
      relations: ["user", "product"],
    });
    if (!foundStore) {
      return { errors: [{ field: "store", message: "store does not exist!" }] };
    }

    if (foundStore.user.id !== userId) {
      return {
        errors: [
          {
            field: "authorization",
            message: "you are not authorized to add a product on this store!",
          },
        ],
      };
    }
    const product = getRepository(Product);
    const createdProduct = product.create({ ...args, store: foundStore });
    foundStore.product.push(createdProduct);
    await store.save(foundStore);
    const savedProduct = await product.save(createdProduct);

    return { product: savedProduct };
  }
}
