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
import { ObjectType } from "type-graphql";
@ObjectType()
@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  store_name: string;

  @Column("text")
  store_description: string;

  @ManyToOne(() => User, (user) => user.store)
  user: Promise<User>;

  @OneToMany(() => Product, (product) => product.store)
  product: Promise<Product[]>;

  @OneToOne(() => StorePhoto, (storePhoto) => storePhoto.store)
  @JoinColumn()
  store_photo: Promise<StorePhoto>;
}
