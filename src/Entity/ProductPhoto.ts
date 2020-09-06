import { Photo } from "./Photo";
import { ManyToOne, Entity } from "typeorm";
import { Product } from "./Product";
import { ObjectType } from "type-graphql";
@ObjectType({ implements: Photo })
@Entity()
export class ProductPhoto extends Photo {
  @ManyToOne(() => Product, (product) => product.photos)
  product: Promise<Product>;
}
