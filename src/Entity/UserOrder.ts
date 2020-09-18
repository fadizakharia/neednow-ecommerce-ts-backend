import { ManyToOne, Entity, OneToMany } from "typeorm";

import { User } from "./User";
import { ObjectType } from "type-graphql";

import { Order } from "./order";
import { ItemProduct } from "./ItemProduct";

@ObjectType()
@Entity()
export class UserOrder extends Order {
  @ManyToOne(() => User, (user) => user.order)
  user: User;
  @OneToMany(() => ItemProduct, (iproduct) => iproduct.userOrder)
  itemProduct: Array<ItemProduct>;
}
