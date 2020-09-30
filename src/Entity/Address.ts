import { PrimaryGeneratedColumn, Column } from "typeorm";
import { Field, ID, InterfaceType, ObjectType } from "type-graphql";

@InterfaceType()
@ObjectType()
export abstract class Address {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("text")
  longitude: string;

  @Field(() => String)
  @Column("text")
  latitude: string;

  @Field(() => String)
  @Column("text")
  country: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  state: string;

  @Field(() => String)
  @Column("text")
  city: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  postalCode: string;

  @Field(() => String)
  @Column("text")
  address_line_1: string;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  address_line_2: string;
}
