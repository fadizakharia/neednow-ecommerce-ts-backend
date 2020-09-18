import {
  OneToMany,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  Entity,
} from "typeorm";
import { ItemProduct } from "./ItemProduct";
import { User } from "./User";
import { ObjectType, Field, Int, ID } from "type-graphql";
// import { Consumer } from "./Consumer";
@ObjectType()
@Entity()
export class Cart {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ItemProduct, (cprod) => cprod.cart, { nullable: true })
  cart_product: Array<ItemProduct>;

  @OneToOne(() => User, (user) => user.cart)
  user: User;
  @Field(() => Int, { nullable: true })
  @Column("float8", { nullable: true })
  total: number;
}
