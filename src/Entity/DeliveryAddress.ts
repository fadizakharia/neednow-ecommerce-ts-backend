import { Address } from "./Address";
import { Entity, OneToOne } from "typeorm";
import { ObjectType } from "type-graphql";
import { Order } from "./Order";

@Entity()
@ObjectType()
export class DeliveryAddress extends Address {
  @OneToOne(() => Order, (order) => order.address)
  order: Order;
}
