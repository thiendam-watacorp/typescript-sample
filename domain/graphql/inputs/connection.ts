import { InputType, Field } from 'type-graphql';
import { Status } from '../../../app/constants/status';

@InputType()
export class ConnectionInput {
  @Field(() => String, { nullable: true })
  userIdConnect!: string;

  @Field(() => Boolean, { nullable: true })
  force?: boolean;

  @Field(() => String, { nullable: true })
  favorite?: string;

  @Field(() => String, { nullable: true })
  status!: Status;
}
