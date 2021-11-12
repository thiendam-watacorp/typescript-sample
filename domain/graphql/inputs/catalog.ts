import { InputType, Field } from 'type-graphql';

@InputType()
export class CatalogInput {
  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  imageUrl?: string;
}
