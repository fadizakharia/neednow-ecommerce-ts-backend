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
import { Order } from "./Order";
import { Store } from "./Store";
import { UserAddress } from "./UserAddress";
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

  @OneToOne(() => UserPhoto, (uphoto) => uphoto.user)
  @JoinColumn()
  user_photo: Promise<UserPhoto>;

  @OneToMany(() => UserAddress, (address) => address.user)
  @JoinColumn()
  address: Promise<UserAddress[]>;

  @OneToOne(() => Cart, (cart) => cart.user)
  @JoinColumn()
  cart: Promise<Cart>;

  @OneToMany(() => Order, (order) => order.user)
  order: Promise<Order[]>;

  @OneToMany(() => Store, (store) => store.user)
  store: Promise<Store[]>;
}
