import { ManyToOne, Entity, OneToOne, JoinColumn, OneToMany } from "typeorm";

import { User } from "./User";
import { ObjectType, Field } from "type-graphql";
import { ItemProduct } from "./ItemProduct";
import { Store } from "./Store";
import { Order } from "./order";

@ObjectType()
@Entity()
export class StoreOrder extends Order {
  @ManyToOne(() => Store, (store) => store.order)
  store: Store;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.storeOrder)
  @JoinColumn()
  customer: User;

  @OneToMany(() => ItemProduct, (iproduct) => iproduct.storeOrder)
  itemProduct: Array<ItemProduct>;
}
