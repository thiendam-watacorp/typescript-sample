import { Resolver, Mutation, Arg, Int, UseMiddleware } from 'type-graphql';
import { IsAuth } from '../../../infrastructure/middleware/is-auth';
import { FeedBack } from '../../entities/feedback';
import { FeedbackInput } from '../inputs/feedback';

@Resolver()
export class FeedbackResolver {
  @Mutation(() => FeedBack, { description: 'Create Feedback' })
  @UseMiddleware(IsAuth)
  async createFeedback(
    @Arg('fields', () => FeedbackInput) fields: FeedbackInput,
  ): Promise<FeedBack> {
    const feedback = FeedBack.create(fields);
    await feedback.save();
    return feedback;
  }

  @Mutation(() => FeedBack, { description: 'Update Feedback' })
  @UseMiddleware(IsAuth)
  async updateFeedback(
    @Arg('id', () => Int) id: number,
    @Arg('fields', () => FeedbackInput) fields: FeedbackInput,
  ): Promise<any> {
    const feedback = await FeedBack.update({ id }, fields);
    return feedback;
  }

  @Mutation(() => Boolean, { description: 'Delete Feedback' })
  @UseMiddleware(IsAuth)
  async deleteFeedback(@Arg('id', () => Int) id: number): Promise<any> {
    await FeedBack.delete(id);
    return true;
  }

  @Mutation(() => Boolean, { description: 'Soft remove Feedback' })
  @UseMiddleware(IsAuth)
  async removeFeedback(@Arg('id', () => Int) id: number): Promise<any> {
    const feedback = await FeedBack.findOne({ where: { id } });
    if (feedback) {
      const result = await FeedBack.softRemove(feedback);
      return !!result.deletedAt;
    } else {
      return false;
    }
  }
}
