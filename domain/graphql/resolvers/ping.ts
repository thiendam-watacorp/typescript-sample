// Ping Health Check

import { Query, Resolver } from 'type-graphql';

@Resolver()
export class PingResolver {
  @Query(() => String)
  ping(): string {
    return 'Pong!';
  }
}
