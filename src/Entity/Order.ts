import { Column, PrimaryGeneratedColumn } from "typeorm";
import { Field, ID, InterfaceType } from "type-graphql";
@InterfaceType()
export abstract class Order {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Number)
  @Column("float4")
  total: number;

  @Field(() => String)
  @Column("varchar")
  orderType: string;

  @Field(() => String)
  @Column("varchar")
  orderStatus: string;
}
