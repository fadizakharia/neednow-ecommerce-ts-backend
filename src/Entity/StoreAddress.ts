import { Address } from "./Address";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Store } from "./Store";

@Entity()
@ObjectType()
export class StoreAddress extends Address {
  @Field(() => Store)
  @OneToOne(() => Store, (store) => store.address)
  @JoinColumn()
  store: Store;
  @Field(() => Number)
  @Column("int")
  range: number;
}
