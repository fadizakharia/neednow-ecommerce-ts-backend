import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { ProductPhoto } from "./ProductPhoto";
import { Store } from "./Store";
import { CartProduct } from "./CartProduct";
import { ObjectType, Field, ID, Int } from "type-graphql";
@ObjectType()
@Entity()
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;
  @Field(() => String)
  @Column("text")
  name: string;
  @Field(() => Number)
  @Column("float8")
  price: number;
  @Field(() => String)
  @Column("text")
  description: string;
  @Field(() => Number)
  @Column("float4")
  rating: number;
  @Field(() => Int)
  @Column("integer")
  stock: number;
  @OneToMany(() => ProductPhoto, (productPhoto) => productPhoto.product)
  photos: Promise<ProductPhoto[]>;
  @ManyToOne(() => Store, (store) => store.product)
  store: Promise<Store>;
  @OneToOne(() => CartProduct, (cpod) => cpod.product)
  cart_product: Promise<CartProduct>;
}
