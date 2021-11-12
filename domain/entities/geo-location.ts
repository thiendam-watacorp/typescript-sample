import { Field, ObjectType, ID } from 'type-graphql';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Entity()
export class Geolocation extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  catalogId!: string;

  @Field()
  @Column()
  longitude!: string;

  @Field()
  @Column()
  latitude!: string;
}
