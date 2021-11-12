import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Property } from './property';

@ObjectType()
@Entity()
export class Catalog extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  address?: string;

  @Field()
  @Column()
  state?: string;

  @Field()
  @Column()
  country?: string;

  @Field()
  @Column()
  price?: number;

  @Field()
  @Column()
  imageUrl?: string;

  @OneToMany(() => Property, property => property.catalog)
  properties?: Property[];

  @Field({ nullable: true })
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @Field({ nullable: true })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt?: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt?: Date;
}
