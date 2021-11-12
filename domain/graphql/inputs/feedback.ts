import { InputType, Field } from 'type-graphql';

@InputType()
export class FeedbackInput {
  @Field({ nullable: true })
  lot?: string;

  @Field({ nullable: true })
  homeStyle?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  homeConfiguration?: string;

  @Field({ nullable: true })
  price?: string;

  @Field({ nullable: true })
  homeAmenities?: string;
}
