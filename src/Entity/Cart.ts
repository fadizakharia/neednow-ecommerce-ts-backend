import {
  OneToMany,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  Entity,
} from "typeorm";
import { CartProduct } from "./CartProduct";
import { User } from "./User";
import { ObjectType, Field, Int, ID } from "type-graphql";
// import { Consumer } from "./Consumer";
@ObjectType()
@Entity()
export class Cart {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CartProduct, (cprod) => cprod.cart, { nullable: true })
  cart_product: Promise<CartProduct[]>;

  @OneToOne(() => User, (user) => user.cart)
  user: Promise<User>;
  @Field(() => Int, { nullable: true })
  @Column("float8", { nullable: true })
  total: number;
}
