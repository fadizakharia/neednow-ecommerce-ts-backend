import { PrimaryGeneratedColumn, Column } from "typeorm";
import { Field, ID, InterfaceType } from "type-graphql";
import { IsOptional } from "class-validator";

@InterfaceType()
export abstract class Address {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Number, { nullable: true })
  @Column("float8", { nullable: true })
  longitude: number;

  @Field(() => Number, { nullable: true })
  @Column("float8", { nullable: true })
  latitude: number;

  @Field(() => String)
  @Column("text")
  country: string;

  @Field(() => String)
  @Column({ type: "text", nullable: true })
  @IsOptional()
  state: string;

  @Field(() => String)
  @Column("text")
  city: string;

  @Field(() => String)
  @Column("text")
  address_line_1: string;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  @IsOptional()
  address_line_2: string;
}
