import { InputType, Field } from 'type-graphql';

@InputType()
export class GeoLocationInput {
  @Field({ nullable: true })
  catalogId?: string;

  @Field({ nullable: true })
  longitude?: string;

  @Field({ nullable: true })
  latitude?: string;
}
