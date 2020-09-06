import { PrimaryGeneratedColumn, ManyToOne, OneToOne, Entity } from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";
import { Order } from "./Order";
import { ObjectType, Field, ID } from "type-graphql";
@ObjectType()
@Entity()
export class CartProduct {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.cart_product)
  cart: Promise<Cart>;

  @ManyToOne(() => Order, (order) => order.cart_product)
  order: Promise<Order>;

  @OneToOne(() => Product, (product) => product.cart_product)
  product: Promise<Product>;
}
