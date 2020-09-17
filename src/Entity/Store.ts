import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  Entity,
  // JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";
import { StorePhoto } from "./StorePhoto";
import { Field, ID, ObjectType } from "type-graphql";
import { StoreAddress } from "./StoreAddress";
@ObjectType()
@Entity()
export class Store {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;
  @Field(() => String)
  @Column("text")
  storeName: string;
  @Field(() => String)
  @Column("text")
  storeDescription: string;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.store)
  user: User;

  @OneToMany(() => Product, (product) => product.store)
  product: Product[];

  @OneToOne(() => StorePhoto, (storePhoto) => storePhoto.store)
  storePhoto: StorePhoto;

  @OneToOne(() => StoreAddress, (address) => address.store)
  address: StoreAddress;
}
