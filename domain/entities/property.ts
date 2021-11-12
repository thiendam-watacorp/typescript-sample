import { Field, ID, ObjectType } from 'type-graphql';

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Catalog } from './catalog';
import { FeedBack } from './feedback';
import { Share } from './share';
import { UserProfile } from './user-profile';

@ObjectType()
@Entity()
export class Property extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bedRoom?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  fullBath?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  haftBath?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  width?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  longs?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  status?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  taxes?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  built?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  hoa?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  day?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  MLSId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lot?: string;

  @Field(() => UserProfile)
  @ManyToOne(() => UserProfile, userProfile => userProfile.properties)
  user?: UserProfile;

  @Field(() => Catalog)
  @OneToOne(() => Catalog, catalog => catalog.properties)
  catalog?: Catalog;

  @Field(() => FeedBack)
  @OneToMany(() => FeedBack, feedback => feedback.property)
  feedbacks?: UserProfile;

  @Field(() => Share)
  @OneToMany(() => Share, share => share.property)
  shares?: UserProfile;

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
