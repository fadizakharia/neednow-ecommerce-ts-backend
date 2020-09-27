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
import { updateItemProductInput } from "./updateItemProduct/input";
import { updateItemProductSchema } from "./updateItemProduct/validation";
import { DeleteFromCartInput } from "./deleteFromCart/deleteFromCart-input";
import { deleteFromCartSchema } from "./deleteFromCart/deleteFromCart-validation";
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
      relations: ["cart", "cart.item_product", "cart.item_product.product"],
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
  @Authorized()
  @Mutation(() => CartResponse)
  async deleteFromCart(
    @Ctx() ctx: Context,
    @Arg("args") args: DeleteFromCartInput
  ): Promise<CartResponse> {
    const userId = ctx.req.session!.userId;
    const errors: { field: string; message: string }[] = [];
    await deleteFromCartSchema
      .validate({ ...args })
      .catch(function (err: ValidationError) {
        err.inner.forEach((e) => {
          errors.push({ field: e.path, message: e.message });
        });
      });
    if (errors.length > 0) {
      return { errors };
    }
    const user = getRepository(User);
    const itemProduct = getRepository(ItemProduct);
    const cart = getRepository(Cart);
    const currentItem = await itemProduct.findOne({
      where: { id: args.itemProductId },
      relations: ["cart"],
    });
    const currentUser = await user.findOne({
      where: { id: userId },
      relations: ["cart"],
    });
    if (currentUser && currentItem) {
      if (currentUser.cart.id !== currentItem.cart.id) {
        return {
          errors: [
            {
              field: "authorization",
              message:
                "you are not allowed to delete someone else's items from cart",
            },
          ],
        };
      }
      await itemProduct.delete(currentItem);
      const UserCart = (await user.findOne({
        where: { id: userId },
        relations: ["cart", "cart.item_product", "cart.user"],
      }))!.cart;
      UserCart.total = +(UserCart.total - currentItem.price).toFixed(2);
      await cart.save(UserCart);
      const updatedUserCart = (await user.findOne({
        where: { id: userId },
        relations: ["cart", "cart.item_product", "cart.user"],
      }))!.cart;
      return { cart: updatedUserCart };
    } else {
      return {
        errors: [
          { field: "item", message: "item does not exist on your cart" },
        ],
      };
    }
  }
  @Authorized()
  @Mutation(() => CartResponse)
  async updateItemProduct(
    @Ctx() ctx: Context,
    @Arg("args") args: updateItemProductInput
  ): Promise<CartResponse> {
    const userId = ctx.req.session!.userId;
    const errors: { field: string; message: string }[] = [];

    await updateItemProductSchema
      .validate({ ...args }, { abortEarly: false })
      .catch((e: ValidationError) => {
        e.inner.forEach((err: any) => {
          errors.push({ field: err.path, message: err.message });
        });
      });
    if (errors.length > 0) {
      return { errors };
    }
    const itemProduct = getRepository(ItemProduct);
    const cart = getRepository(Cart);
    const user = getRepository(User);
    const currentItemProduct = await itemProduct.findOne({
      where: { id: args.itemProductId },
      relations: ["cart", "product", "cart.user"],
    });
    if (currentItemProduct) {
      const currentUser = await user.findOne({ id: userId });
      if (currentItemProduct.cart.user.id !== currentUser!.id) {
        return {
          errors: [
            {
              field: "authorization",
              message:
                "you are unauthorized to decrement someone else's item from cart",
            },
          ],
        };
      }
      if (currentItemProduct.quantity === currentItemProduct.product.stock) {
        return {
          errors: [
            {
              field: "quantity",
              message: "quantity can not be more than the store's stock",
            },
          ],
        };
      }
      const previousItemPrice = currentItemProduct.price;
      const baseCartTotal = currentItemProduct.cart.total - previousItemPrice;
      currentItemProduct.quantity = args.quantity;
      currentItemProduct.price =
        currentItemProduct.product.price * args.quantity;
      currentItemProduct.cart.total = baseCartTotal + currentItemProduct.price;
      await itemProduct.save(currentItemProduct);
      await cart.save(currentItemProduct.cart);
      const updatedCart = await cart.findOne({
        where: { id: currentItemProduct.cart.id },
        relations: ["item_product", "user", "item_product.product"],
      });
      return { cart: updatedCart };
    } else {
      return {
        errors: [{ field: "cartItem", message: "item does not exist in cart" }],
      };
    }
  }
}
