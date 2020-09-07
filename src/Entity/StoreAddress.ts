import { Address } from "./Address";
import { Entity, OneToOne } from "typeorm";
import { ObjectType } from "type-graphql";
import { Store } from "./Store";

@Entity()
@ObjectType()
export class StoreAddress extends Address {
  @OneToOne(() => Store, (store) => store.address)
  store: Store;
}
