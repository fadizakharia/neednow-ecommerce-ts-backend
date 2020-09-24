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
      relations: ["cart"],
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
    const currentUser = await userRepository.findOne({
      where: { id: userId },
    });
    let userCart = (await cartRepository.findOne({
      where: { user: currentUser },
      relations: ["user"],
    })) as Cart;

    // console.log(userCart);

    if (currentProduct) {
      let createdItem: ItemProduct | undefined;
      createdItem = await itemProductRepository.findOne({
        where: { cart: userCart, product: currentProduct },
      });
      if (createdItem) {
        createdItem.quantity = createdItem.quantity + args.quantity;
        createdItem.price = +(
          createdItem.price +
          args.quantity * currentProduct.price
        ).toFixed(2);
      } else {
        createdItem = itemProductRepository.create({
          quantity: args.quantity,
          price: +(currentProduct.price * args.quantity).toFixed(2),
          product: currentProduct,
        });
        userCart.item_product.push(createdItem);
        createdItem.cart = userCart;
      }
      if (currentProduct.stock < createdItem.quantity) {
        return {
          errors: [
            {
              field: "quantity",
              message: "requested quantity exceeds current stock of product",
            },
          ],
        };
      }
      // console.log(createdItem);
      userCart.total = +(
        userCart.total +
        args.quantity * currentProduct.price
      ).toFixed(2);

      await cartRepository.save(userCart);
      await itemProductRepository.save(createdItem);
      const savedCart = await cartRepository.findOne({
        where: { user: currentUser },
        relations: ["user"],
      });
      return { cart: savedCart };
    }
    return {
      errors: [{ field: "product", message: "product does not exist" }],
    };
  }
}
