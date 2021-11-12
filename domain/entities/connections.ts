import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  Unique,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Favorite } from '../../app/constants/favorite';
import { Status } from '../../app/constants/status';
import { UserProfile } from './user-profile';

@ObjectType()
@Entity()
@Unique('UQ_CONNECTION', ['realtorId', 'buyerId'])
export class Connection extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  realtorId!: string;

  @Field()
  @Column()
  buyerId!: string;

  @Field()
  buyer?: UserProfile;

  @Field()
  @Column()
  createdBy!: string;

  @Field({ nullable: true })
  @Column({
    type: 'enum',
    enum: [null, 'realtor', 'buyer', 'both'],
    default: null,
  })
  favorited!: Favorite;

  @Field({ nullable: true })
  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status!: Status;

  @Field({ nullable: true })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt?: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt?: Date;
}
