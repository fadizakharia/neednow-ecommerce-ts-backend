import { Address } from "./Address";
import { Entity, OneToOne } from "typeorm";
import { ObjectType } from "type-graphql";
import { User } from "./User";

@Entity()
@ObjectType()
export class UserAddress extends Address {
  @OneToOne(() => User, (user) => user.address)
  user: User;
}
