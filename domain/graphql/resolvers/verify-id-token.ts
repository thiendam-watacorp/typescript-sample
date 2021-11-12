import { Query, ObjectType, Field, Resolver, Arg } from 'type-graphql';
import firebase from '../../../infrastructure/db/firebase';

@ObjectType()
abstract class VerifyIdTokenResponse {
  @Field(() => String)
  user_id!: string;

  @Field(() => String)
  email: string | undefined;

  @Field(() => Boolean)
  email_verified: boolean | undefined;
}
@Resolver()
export class VerifyIdTokenResolver {
  @Query(() => VerifyIdTokenResponse)
  async verifyIdToken(@Arg('token', () => String) token: string): Promise<VerifyIdTokenResponse> {
    const { user_id, email, email_verified } = await firebase.auth().verifyIdToken(token);

    return {
      user_id,
      email,
      email_verified,
    };
  }
}
