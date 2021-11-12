import { Mutation, Query, Resolver, Arg } from 'type-graphql';
import firebase from '../../../infrastructure/db/firebase';

@Resolver()
export class CheckDisabledResolver {
  @Mutation(() => Boolean, { description: 'Check user disabled' })
  async checkInactive(@Arg('email', () => String) email: string): Promise<boolean> {
    const user = await firebase.auth().getUserByEmail(email);
    return user.disabled;
  }

  @Query(() => Boolean, { description: 'Check user disabled' })
  async checkDisabled(@Arg('email', () => String) email: string): Promise<boolean> {
    const user = await firebase.auth().getUserByEmail(email);
    return user.disabled;
  }
}
