import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { ValidationError } from "yup";
import { Cart } from "../../Entity/Cart";
import { ItemProduct } from "../../Entity/ItemProduct";
import { Product } from "../../Entity/Product";
import { User } from "../../Entity/User";
import { Context } from "../types/context";
import { AddToCartInput } from "./addToCart/addToCart-input";
import { AddToCartValidation } from "./addToCart/addToCart-validation";
import { CartResponse } from "./response/CartResponse";

@Resolver()
export class cartResolver {
  @Authorized()
  @Query(() => CartResponse)
  async getCart(@Ctx() ctx: Context): Promise<CartResponse> {
    const userId = ctx.req.session!.userId;
    const userRepository = getRepository(User);
    const currentUser = await userRepository.findOne({
      where: { id: userId },
      relations: ["cart.cart_product"],
    });
    if (currentUser?.cart) {
      return { cart: currentUser.cart };
    }
    return {
      errors: [{ field: "cart", message: "user does not have a cart" }],
    };
  }
  @Authorized()
  @Mutation(() => CartResponse)
  async addToCart(
    @Ctx() ctx: Context,
    @Arg("args") args: AddToCartInput
  ): Promise<CartResponse> {
    const userId = ctx.req.session!.userId;
    const error: { field: string; message: string }[] = [];
    await AddToCartValidation.validate(
      { ...args },
      { abortEarly: false }
    ).catch(function (err: ValidationError) {
      err.inner.forEach((e: any) => {
        error.push({ field: e.path, message: e!.message });
      });
    });
    if (error.length > 0) {
      return { errors: error };
    }
    const itemProductRepository = getRepository(ItemProduct);
    const productRepository = getRepository(Product);
    const userRepository = getRepository(User);
    const cartRepository = getRepository(Cart);
    const currentProduct = await productRepository.findOne({
      where: { id: args.productId },
    });
    const currentUser = await userRepository.findOne({ where: { id: userId } });
    const userCart = await cartRepository.findOne({
      where: { user: currentUser },
      relations: ["cart_product"],
    });

    if (currentProduct && userCart) {
      if (userCart?.total) {
        userCart.total = userCart.total + args.Quantity * currentProduct.price;
      }
      userCart!.total = args.Quantity + currentProduct.price;
      const createdItem = itemProductRepository.create({
        quantity: args.Quantity,
        price: currentProduct.price * args.Quantity,
        product: currentProduct,
        cart: userCart,
      });
      const savedItem = await itemProductRepository.save(createdItem);
      userCart.cart_product.push(savedItem);
      const savedCart = await cartRepository.save(userCart);
      return { cart: savedCart };
    }
    return {
      errors: [{ field: "product", message: "product does not exist" }],
    };
  }
}
