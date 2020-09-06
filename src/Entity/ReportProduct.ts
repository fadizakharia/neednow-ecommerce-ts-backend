import { OneToMany, Entity } from "typeorm";
import { Report } from "./Report";
import { Product } from "./Product";
import { ObjectType } from "type-graphql";
@ObjectType({ implements: Report })
@Entity()
export class ReportProduct extends Report {
  @OneToMany(() => Product, (product) => product.id)
  product: Promise<Product>;
}
