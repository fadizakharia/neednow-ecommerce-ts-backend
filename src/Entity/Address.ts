import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { IsOptional } from "class-validator";

@ObjectType()
@Entity()
export class Address extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Number)
  @Column("float8")
  longitude: number;

  @Field(() => Number)
  @Column("float8")
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

  @Field(() => String)
  @Column("text")
  @IsOptional()
  address_line_2: string;
}
