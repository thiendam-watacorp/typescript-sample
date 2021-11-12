import { Field, ID, ObjectType } from 'type-graphql';

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Property } from './property';
import { UserProfile } from './user-profile';

@ObjectType()
@Entity()
export class Share extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'text' })
  content!: string;

  @ManyToOne(() => Property, property => property.shares)
  property!: Property;

  @ManyToOne(() => UserProfile, userProfile => userProfile.shares)
  user!: UserProfile;

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
