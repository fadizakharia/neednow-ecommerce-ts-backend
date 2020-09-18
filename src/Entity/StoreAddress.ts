import { Address } from "./Address";
import { Column, Entity, OneToOne } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Store } from "./Store";

@Entity()
@ObjectType()
export class StoreAddress extends Address {
  @OneToOne(() => Store, (store) => store.address)
  store: Store;
  @Field(() => Number)
  @Column("int")
  deliveryDistance: number;
}
