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
export class FeedBack extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lot?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  homeStyle?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  homeConfiguration?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  price?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  homeAmenities?: string;

  @ManyToOne(() => Property, property => property.feedbacks)
  property!: Property;

  @ManyToOne(() => UserProfile, userProfile => userProfile.feedbacks)
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
