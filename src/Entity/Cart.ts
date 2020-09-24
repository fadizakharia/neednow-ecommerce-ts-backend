import {
  OneToMany,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  Entity,
  JoinColumn,
} from "typeorm";
import { ItemProduct } from "./ItemProduct";
import { User } from "./User";
import { ObjectType, Field, ID } from "type-graphql";
// import { Consumer } from "./Consumer";
@ObjectType()
@Entity()
export class Cart {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;
  @Field(() => [ItemProduct])
  @OneToMany(() => ItemProduct, (cprod) => cprod.cart, { eager: true })
  item_product: Array<ItemProduct>;
  @Field(() => User)
  @OneToOne(() => User, (user) => user.cart, {
    cascade: ["remove", "insert", "update"],
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;
  @Field(() => Number, { nullable: true })
  @Column("float4", { default: 0 })
  total: number;
}
