import { Int, Field, ArgsType } from 'type-graphql';

@ArgsType()
export default class PaginationArgs {
  @Field(() => Int, { defaultValue: 12 })
  limit?: number;

  @Field(() => Int, { defaultValue: 0 })
  offset?: number;

  @Field({ defaultValue: 'updatedAt' })
  sortBy?: string;

  @Field({ defaultValue: 'DESC' })
  sortType?: string;

  @Field({ nullable: true })
  keyword?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  role?: string;
}
