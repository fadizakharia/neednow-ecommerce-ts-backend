import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
@ObjectType()
@Entity("Users")
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "text", unique: true })
  username: string;

  @Field()
  @Column({ type: "text", unique: true })
  email: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 26 })
  firstName: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 26 })
  lastName: string;

  @Field(() => Number)
  @Column({ type: "integer" })
  age: number;

  @Column({ type: "text" })
  password: string;

  @Field(() => Number)
  @Column({ type: "integer" })
  zipcode: number;

  @Field(() => String)
  @Column({ type: "text" })
  state: string;

  @Field(() => String)
  @Column({ type: "text" })
  address_line_1: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  address_line_2: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  profile_picture_uri: string;
}
