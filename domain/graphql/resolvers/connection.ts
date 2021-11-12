import { UserInputError } from 'apollo-server-express';
import {
  Arg,
  Root,
  FieldResolver,
  Ctx,
  Query,
  Mutation,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { Not } from 'typeorm';
import { Favorite } from '../../../app/constants/favorite';
import { AppContext } from '../../../infrastructure/contexts/app-context';
import { IsAuth } from '../../../infrastructure/middleware/is-auth';
import { Connection } from '../../entities/connections';
import { UserProfile } from '../../entities/user-profile';
import { ConnectionInput } from '../inputs/connection';

const isFavorite = (role: string, favorite: string | null, favorited: string | null): Favorite => {
  if (favorite === 'remove') {
    // Only remove same role
    return favorited === 'both'
      ? role === 'realtor'
        ? 'buyer'
        : 'realtor'
      : role === favorited
      ? null
      : (favorited as Favorite);
  }
  // Check if the realtor/buyer existing favorited, update to 'both'
  if (favorited) {
    return favorite === 'add' && role !== favorited ? 'both' : (role as Favorite);
  } else {
    return favorite === 'add' ? (role as Favorite) : null;
  }
};

@Resolver(() => Connection)
export class ConnectionResolver {
  @Query(() => [Connection], { description: 'Get all connection' })
  @UseMiddleware(IsAuth)
  async getConnection(
    @Arg('status', { nullable: true }) status: string,
    @Ctx() ctx: AppContext,
  ): Promise<Connection[] | undefined> {
    const { user_id } = ctx.req.session?.user;
    const user = await UserProfile.findOne({ where: { id: user_id } });
    if (!user) {
      return undefined;
    }
    const args: {
      status?: any;
      realtorId?: string;
      buyerId?: string;
    } = status ? { status } : { status: Not('rejected') };

    if (user.role === 'realtor') {
      args.realtorId = user_id;
    } else {
      args.buyerId = user_id;
    }

    return await Connection.find({ where: args });
  }

  @FieldResolver()
  async buyer(@Root() connection: Connection): Promise<UserProfile> {
    const buyer = await UserProfile.findOne({ where: { id: connection.buyerId } });
    if (!buyer) {
      throw new UserInputError('Buyer not exist.');
    }
    return buyer;
  }

  @Mutation(() => Connection, { description: 'Create or update connection' })
  @UseMiddleware(IsAuth)
  async upsertConnection(
    @Arg('fields', () => ConnectionInput) fields: ConnectionInput,
    @Ctx() ctx: AppContext,
  ): Promise<any> {
    const { user_id } = ctx.req.session?.user;
    const { force, userIdConnect, favorite = null, status } = fields;
    if (!user_id) {
      throw new UserInputError('No user found.');
    }

    const user = await UserProfile.findOne({ where: { id: user_id } });
    if (!user) {
      throw new UserInputError('No user found.');
    }

    if (user.role === 'realtor') {
      // Delete connection if reject
      if (status === 'rejected') {
        Connection.delete({ realtorId: user_id, buyerId: userIdConnect });
        return { status: 'rejected' };
      }
      const realtorUser = await Connection.findOne({
        where: { buyerId: userIdConnect, realtorId: user_id },
      });
      // Check if existing connection exists before updating favorite
      if (realtorUser) {
        const favorited = isFavorite('realtor', favorite, realtorUser.favorited);
        if (favorite) {
          Object.assign(realtorUser, { favorited });
        }

        if (status) {
          Object.assign(realtorUser, { status });
        }
        await realtorUser.save();
        return realtorUser;
      } else {
        // REALTOR can mutiple connections to buyer
        const favorited = isFavorite('realtor', favorite, null);
        const newConnection = await Connection.create({
          realtorId: user_id,
          buyerId: userIdConnect,
          createdBy: user_id,
          status,
          favorited,
        }).save();
        return newConnection;
      }
    } else {
      // Delete connection if reject
      if (status === 'rejected') {
        await Connection.delete({ buyerId: user_id, realtorId: userIdConnect });
        return { status: 'rejected' };
      }
      // Buyer role, only one connection with realtor
      const updateUser = await Connection.find({
        where: { buyerId: user_id },
      });
      const usrConnected = updateUser.filter(it => it.status === 'accepted');
      if (updateUser && updateUser.length) {
        // force will delete all connection and create new
        if (force) {
          await Connection.delete({ buyerId: user_id });
          const newConnection = await Connection.create({
            realtorId: userIdConnect,
            buyerId: user_id,
            createdBy: user_id,
            status,
          }).save();
          return newConnection;
        }

        //when status is 'accepted' and have another connected with status 'accepted'
        // throw err
        if (
          status === 'accepted' &&
          usrConnected.length &&
          userIdConnect !== usrConnected[0].realtorId &&
          !favorite
        ) {
          const currRealterConnected = await UserProfile.findOne({
            select: ['email', 'firstName', 'lastName'],
            where: { id: usrConnected[0].realtorId },
          });
          //'Buyer connect already in esist.'
          throw new UserInputError('Buyer connect already in esist.', {
            currRealterConnected,
          });
        }

        //find current connected
        const currentConnect = await Connection.findOne({
          where: { buyerId: user_id, realtorId: userIdConnect },
        });
        if (!currentConnect) {
          throw new UserInputError('No connection found.');
        }

        //if do not have connected with status 'accepted', update normal
        //other connection will be delete
        if (!usrConnected.length && !favorite) {
          const otherConnect: any[] = [];
          //find other connection
          updateUser.forEach(x => {
            if (x.realtorId !== currentConnect.realtorId) {
              otherConnect.push(x.id);
            }
          });

          //delete other connection
          if (otherConnect.length) {
            await Connection.delete(otherConnect);
          }

          //update current connection
          Object.assign(currentConnect, { status });
          await currentConnect.save();
          return currentConnect;
        }

        // update favorite
        const favorited = isFavorite('buyer', favorite, currentConnect.favorited);
        if (favorite) {
          Object.assign(currentConnect, { favorited });
          await currentConnect.save();
        }
        return currentConnect;
      } else {
        const favorited = isFavorite('buyer', favorite, null);
        // Not existing connection
        const newConnection = await Connection.create({
          realtorId: userIdConnect,
          buyerId: user_id,
          createdBy: user_id,
          status,
          favorited,
        }).save();
        return newConnection;
      }
    }
  }

  @Mutation(() => Boolean, { description: 'Delete connection' })
  @UseMiddleware(IsAuth)
  async deleteConnection(
    @Arg('realtorId', () => String) realtorId: string,
    @Arg('buyerId', () => String) buyerId: string,
  ): Promise<boolean> {
    const result = await Connection.delete({ buyerId, realtorId });
    return !!result.affected;
  }
}
