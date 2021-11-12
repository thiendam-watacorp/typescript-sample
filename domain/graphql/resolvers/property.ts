import { Resolver, Query, Mutation, Arg, Int, UseMiddleware } from 'type-graphql';
import { Property } from '../../entities/property';
import { IsAuth } from '../../../infrastructure/middleware/is-auth';
import { PropertyInput } from '../inputs/property';

@Resolver()
export class PropertyResolver {
  @Query(() => [Property], { description: 'Get all property' })
  @UseMiddleware(IsAuth)
  async propertyList(): Promise<Property[]> {
    const property = await Property.find();
    return property;
  }

  @Mutation(() => Property, { description: 'Create property' })
  @UseMiddleware(IsAuth)
  async createProperty(
    @Arg('fields', () => PropertyInput) fields: PropertyInput,
  ): Promise<Property> {
    const property = Property.create(fields);
    return await property.save();
  }

  @Mutation(() => Property, { description: 'Update property' })
  @UseMiddleware(IsAuth)
  async updateProperty(
    @Arg('id', () => Int) id: number,
    @Arg('fields', () => PropertyInput) fields: PropertyInput,
  ): Promise<any> {
    const property = await Property.update({ id }, fields);
    return property;
  }

  @Mutation(() => Boolean, { description: 'Delete property' })
  @UseMiddleware(IsAuth)
  async deleteProperty(@Arg('id', () => Int) id: number): Promise<any> {
    await Property.delete(id);
    return true;
  }

  @Mutation(() => Boolean, { description: 'Soft remove property' })
  @UseMiddleware(IsAuth)
  async removeProperty(@Arg('id', () => Int) id: number): Promise<any> {
    const property = await Property.findOne({ where: { id } });
    if (property) {
      const result = await Property.softRemove(property);
      return !!result.deletedAt;
    } else {
      return false;
    }
  }
}
