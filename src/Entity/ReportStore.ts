import { OneToMany, Entity } from "typeorm";
import { Report } from "./Report";

import { Store } from "./Store";
import { ObjectType } from "type-graphql";
@ObjectType({ implements: Report })
@Entity()
export class ReportStore extends Report {
  @OneToMany(() => Store, (store) => store.id)
  user: Store;
}
