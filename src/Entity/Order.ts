import {
  OneToMany,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Entity,
} from "typeorm";
import { CartProduct } from "./CartProduct";
import { User } from "./User";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Order {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CartProduct, (cprod) => cprod.order)
  cart_product: Promise<CartProduct[]>;

  @ManyToOne(() => User, (user) => user.order)
  user: Promise<User>;
  @Field(() => Number)
  @Column("float8")
  total: number;
}
