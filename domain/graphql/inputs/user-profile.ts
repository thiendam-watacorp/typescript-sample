import { InputType, Field } from 'type-graphql';
import { Length } from 'class-validator';
import { UserRole } from '../../../app/constants/user-role';

@InputType()
export class UserUpdateInput {
  @Field()
  @Length(1, 32)
  firstName!: string;

  @Field()
  @Length(1, 32)
  lastName!: string;

  @Field(() => String)
  role!: UserRole;

  @Field(() => String, { nullable: true })
  @Length(0, 64)
  brokerageName?: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  profileUrl?: string;

  @Field(() => String, { nullable: true })
  MLS?: string;

  @Field(() => String, { nullable: true })
  agentId?: string;
}
