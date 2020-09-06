import { PrimaryGeneratedColumn, Column } from "typeorm";
import { Field, InterfaceType, ID } from "type-graphql";
@InterfaceType()
export abstract class Report {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;
  @Field(() => String)
  @Column()
  description: string;
  @Field(() => String)
  @Column()
  type: string;
}
