import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  Entity,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";
import { StorePhoto } from "./StorePhoto";
import { Field, ID, ObjectType } from "type-graphql";
import { StoreAddress } from "./StoreAddress";
import { StoreOrder } from "./storeOrder";
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
  @Field(() => [Product])
  @OneToMany(() => Product, (product) => product.store)
  @JoinColumn()
  product: Product[];

  @OneToOne(() => StorePhoto, (storePhoto) => storePhoto.store)
  @JoinColumn()
  storePhoto: StorePhoto;

  @OneToMany(() => StoreOrder, (order) => order.store)
  order: Array<StoreOrder>;

  @OneToOne(() => StoreAddress, (address) => address.store)
  @JoinColumn()
  address: StoreAddress;
}
