import { UserInputError } from 'apollo-server-express';
import sqlstring from 'sqlstring';
import { Arg, Args, Ctx, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AppContext } from '../../../infrastructure/contexts/app-context';
import firebase from '../../../infrastructure/db/firebase';
import { IsAuth } from '../../../infrastructure/middleware/is-auth';
import { UserProfile } from '../../entities/user-profile';
import { UserUpdateInput } from '../inputs/user-profile';
import PaginatedResponse from '../types/paginated-response';
import PaginationArgs from '../types/pagination-args';
@ObjectType()
class UserProfileResponse extends PaginatedResponse(UserProfile) {
  // you can add more fields here if you need
}

@Resolver()
export class UserResolver {
  @Query(() => UserProfileResponse, { description: 'Search user with limit, offset and keyword' })
  @UseMiddleware(IsAuth)
  async users(
    @Args()
    {
      limit,
      offset,
      sortBy = 'firstName',
      sortType,
      role = 'buyer',
      keyword = '',
      email = '',
    }: PaginationArgs,
  ): Promise<UserProfileResponse> {
    const order = {
      [`${sortBy}`]: sortType || 'DESC',
    };
    const maxLimit = Number(limit) < 20 ? limit : 20;

    const keywordSafeSearch = '%' + keyword.toLowerCase().replace(/[^a-z0-9@._]/g, '') + '%';
    const emailSafeSearch = '%' + email.toLowerCase().replace(/[^a-z0-9@._]/g, '') + '%';

    const emailSQL = !email
      ? ''
      : sqlstring.format('AND UserProfile.email LIKE ?', [emailSafeSearch]);
    const roleSQL = ['buyer', 'realtor'].includes(role)
      ? sqlstring.format('UserProfile.role = ?', [role])
      : '';
    const keywordSQL = !keyword
      ? ''
      : sqlstring.format(
          [
            'AND ( UserProfile.firstName LIKE ?',
            'UserProfile.lastName LIKE ?',
            'UserProfile.email LIKE ? )',
          ].join(' OR '),
          [keywordSafeSearch, keywordSafeSearch, keywordSafeSearch],
        );

    const args = {
      where: `${roleSQL} ${emailSQL} ${keywordSQL}`,
      ...order,
    };

    const users = await UserProfile.find(args);
    const items = await UserProfile.find({ ...args, skip: offset, take: maxLimit });
    const total = users.length;
    return {
      items,
      hasMore: total > (maxLimit || 0) + (offset || 0),
      total,
    };
  }

  @Mutation(() => UserProfile, { description: 'Create or update user' })
  @UseMiddleware(IsAuth)
  async upsertUserProfile(
    @Arg('fields', () => UserUpdateInput) fields: UserUpdateInput,
    @Ctx() ctx: AppContext,
  ): Promise<any> {
    const { user_id, email } = ctx.req.session?.user;
    if (!user_id) {
      return undefined;
    }
    const user = await UserProfile.findOne({ where: { id: user_id } });
    if (user) {
      const brokerageName = user.role === 'buyer' ? '' : fields.brokerageName;
      Object.assign(user, { ...fields, brokerageName });
      await user.save();
      return user;
    } else {
      // TODO: refactor this logic for better
      const userExist = await UserProfile.findOne({ where: { email } });
      if (userExist) {
        throw new UserInputError('Email already in esist.');
      }
      const brokerageName = fields.role === 'buyer' ? '' : fields.brokerageName;
      Object.assign(fields, {
        id: user_id,
        email,
        brokerageName,
      });
      const newUser = await UserProfile.create(fields).save();
      return newUser;
    }
  }

  @Mutation(() => Boolean, { description: 'Soft remove user' })
  @UseMiddleware(IsAuth)
  async removeUser(@Arg('id', () => String) id: string): Promise<any> {
    const user = await UserProfile.findOne({ where: { id } });
    if (user && user.id) {
      const result = await UserProfile.softRemove(user);
      return !!result.deletedAt;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean, { description: 'Recover user' })
  @UseMiddleware(IsAuth)
  async recoverUser(@Arg('id', () => String) id: string): Promise<any> {
    const user = await UserProfile.findOne({ where: { id }, withDeleted: true });
    if (user) {
      const result = await user.recover();
      return result;
    } else {
      return false;
    }
  }
}

@Resolver()
export class UserProfileResolver {
  @Query(() => UserProfile, { nullable: true })
  @UseMiddleware(IsAuth)
  async profileByID(
    @Arg('user_id', () => String) user_id: string,
  ): Promise<UserProfile | undefined> {
    if (!user_id) {
      return undefined;
    }

    const user = await UserProfile.findOne({ id: user_id });
    return user;
  }
}

@Resolver()
export class MeResolver {
  @Mutation(() => UserProfile, { nullable: true })
  async me(
    @Arg('token', { nullable: true }) token: string,
    @Ctx() ctx: AppContext,
  ): Promise<UserProfile | undefined> {
    const { user_id } = await firebase.auth().verifyIdToken(token || ctx.idToken);
    if (!user_id) {
      return undefined;
    }
    return await UserProfile.findOne({ id: user_id });
  }
}
