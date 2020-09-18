import { Photo } from "./Photo";
import { Entity, OneToOne } from "typeorm";
import { Store } from "./Store";
import { ObjectType } from "type-graphql";
@ObjectType({ implements: Photo })
@Entity()
export class StorePhoto extends Photo {
  @OneToOne(() => Store, (store) => store.storePhoto)
  store: Store;
}
