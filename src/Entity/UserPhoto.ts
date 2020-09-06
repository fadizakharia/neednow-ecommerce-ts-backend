import { Photo } from "./Photo";
import { OneToOne, Entity } from "typeorm";
import { User } from "./User";
import { ObjectType } from "type-graphql";
@ObjectType({ implements: Photo })
@Entity()
export class UserPhoto extends Photo {
  @OneToOne(() => User, (user) => user.user_photo)
  user: Promise<User>;
}
