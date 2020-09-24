import {
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Entity,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { UserPhoto } from "./UserPhoto";
import { Cart } from "./Cart";
import { UserOrder } from "./UserOrder";
import { Store } from "./Store";
import { UserAddress } from "./UserAddress";
import { StoreOrder } from "./storeOrder";
@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: "text", unique: true })
  email: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 26 })
  firstName: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 26 })
  lastName: string;

  @Field(() => Number)
  @Column({ type: "integer" })
  age: number;

  @Column({ type: "text" })
  password: string;
  @Field(() => UserPhoto)
  @OneToOne(() => UserPhoto, (uphoto) => uphoto.user)
  @JoinColumn()
  user_photo: UserPhoto;

  @OneToOne(() => UserAddress, (address) => address.user)
  @JoinColumn()
  address: UserAddress;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToOne(() => StoreOrder, (storeOrder) => storeOrder.customer)
  storeOrder: StoreOrder;

  @OneToMany(() => UserOrder, (order) => order.user)
  order: Array<UserOrder>;

  @OneToMany(() => Store, (store) => store.user)
  store: Array<Store>;
}
