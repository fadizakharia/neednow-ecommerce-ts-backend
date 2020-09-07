import {
  OneToMany,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Entity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { CartProduct } from "./CartProduct";
import { User } from "./User";
import { ObjectType, Field, ID } from "type-graphql";
import { DeliveryAddress } from "./DeliveryAddress";

@ObjectType()
@Entity()
export class Order {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CartProduct, (cprod) => cprod.order)
  cart_product: Promise<CartProduct[]>;

  @Field(() => Number)
  @Column("float4")
  total: number;

  @Column("text")
  orderType: string;

  @ManyToOne(() => User, (user) => user.order)
  user: Promise<User>;

  @OneToOne(() => DeliveryAddress, (address) => address.order)
  @JoinColumn()
  address: Promise<DeliveryAddress>;
}
