import { OneToMany, Entity } from "typeorm";
import { Report } from "./Report";
import { User } from "./User";
import { ObjectType } from "type-graphql";
@ObjectType({ implements: Report })
@Entity()
export class ReportUser extends Report {
  @OneToMany(() => User, (user) => user.id)
  user: Promise<User>;
}
