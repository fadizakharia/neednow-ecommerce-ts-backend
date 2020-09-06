import {
  PrimaryGeneratedColumn,
  Column,
  // BaseEntity,
} from "typeorm";
import { Field, ID, InterfaceType } from "type-graphql";
@InterfaceType()
export abstract class Photo {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  photo_id: number;
  @Field(() => String)
  @Column("text")
  photo_url: string;
}
