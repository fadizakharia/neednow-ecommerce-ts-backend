import {
  PrimaryGeneratedColumn,
  ManyToOne,
  Entity,
  OneToOne,
  Column,
  JoinColumn,
} from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";
import { ObjectType, Field, ID } from "type-graphql";
import { StoreOrder } from "./storeOrder";
import { UserOrder } from "./UserOrder";
@ObjectType()
@Entity()
export class ItemProduct {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Cart)
  @ManyToOne(() => Cart, (cart) => cart.item_product)
  cart: Cart;

  @Field(() => Number)
  @Column("int")
  quantity: number;

  @Field(() => Number)
  @Column("float4")
  price: number;

  @Field(() => Product)
  @OneToOne(() => Product, (product) => product.cart_product, { eager: true })
  @JoinColumn()
  product: Product;
  @ManyToOne(() => StoreOrder, (sorder) => sorder.itemProduct)
  storeOrder: StoreOrder;
  @ManyToOne(() => UserOrder, (uorder) => uorder.itemProduct)
  userOrder: UserOrder;
}
