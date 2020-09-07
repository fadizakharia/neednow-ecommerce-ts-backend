import { Address } from "./Address";
import { Entity, ManyToOne } from "typeorm";
import { ObjectType } from "type-graphql";
import { User } from "./User";

@Entity()
@ObjectType()
export class UserAddress extends Address {
  @ManyToOne(() => User, (user) => user.address)
  user: Promise<User>;
}
