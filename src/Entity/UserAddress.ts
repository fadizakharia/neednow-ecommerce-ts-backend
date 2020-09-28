import { Address } from "./Address";
import { Entity, ManyToOne } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@Entity()
@ObjectType()
export class UserAddress extends Address {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.address)
  user: User;
}
