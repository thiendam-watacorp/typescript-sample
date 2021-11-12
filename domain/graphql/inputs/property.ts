import { InputType, Field } from 'type-graphql';
import { UserRole } from '../../../app/constants/user-role';

@InputType()
export class PropertyInput {
  @Field({ nullable: true })
  role!: UserRole;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  bedRoom?: number;

  @Field({ nullable: true })
  fullbath?: number;

  @Field({ nullable: true })
  haftBath?: number;

  @Field({ nullable: true })
  width?: number;

  @Field({ nullable: true })
  longs?: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  status?: boolean;

  @Field({ nullable: true })
  taxes?: number;

  @Field({ nullable: true })
  built?: number;

  @Field({ nullable: true })
  hoa?: number;

  @Field({ nullable: true })
  day?: number;

  @Field({ nullable: true })
  MLSId?: string;

  @Field({ nullable: true })
  lot?: string;
}
