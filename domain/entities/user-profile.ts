import { Field, ObjectType, Root } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from '../../app/constants/user-role';
import { Property } from './property';
import { FeedBack } from './feedback';
import { Share } from './share';

@ObjectType()
@Entity()
export class UserProfile extends BaseEntity {
  @Field()
  @PrimaryColumn()
  id!: string;

  @Field()
  @Column()
  firstName!: string;

  @Field()
  @Column()
  lastName!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  brokerageName?: string;

  @Field()
  fullName(@Root() parent: UserProfile): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Field()
  @Column({
    type: 'enum',
    enum: ['realtor', 'buyer'],
    default: 'buyer',
  })
  role!: UserRole;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profileUrl?: string;

  @OneToMany(() => Property, property => property.user)
  properties?: Property[];

  @OneToMany(() => FeedBack, feedback => feedback.user)
  feedbacks?: FeedBack[];

  @OneToMany(() => Share, share => share.user)
  shares?: Share[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  MLS?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  agentId?: string;

  @Field({ nullable: true })
  // Defalt expired after 30days
  @Column({ nullable: true, default: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
  expiredAt?: Date;

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
