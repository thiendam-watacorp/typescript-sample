import { Resolver, Mutation, Arg, Int, UseMiddleware } from 'type-graphql';
import { IsAuth } from '../../../infrastructure/middleware/is-auth';
import { Geolocation } from '../../entities/geo-location';
import { GeoLocationInput } from '../inputs/geo-location';

@Resolver()
export class GeoLocationResolver {
  @Mutation(() => Geolocation, { description: 'Create Geolocation' })
  @UseMiddleware(IsAuth)
  async createGeolocation(
    @Arg('fields', () => GeoLocationInput) fields: GeoLocationInput,
  ): Promise<Geolocation> {
    const geolocation = Geolocation.create(fields);
    await geolocation.save();
    return geolocation;
  }

  @Mutation(() => Geolocation, { description: 'Update Geolocation' })
  @UseMiddleware(IsAuth)
  async updateGeolocation(
    @Arg('id', () => Int) id: number,
    @Arg('fields', () => GeoLocationInput) fields: GeoLocationInput,
  ): Promise<any> {
    const geoLocation = await Geolocation.update({ id }, fields);
    return geoLocation;
  }

  @Mutation(() => Boolean, { description: 'Deleta Geolocation' })
  @UseMiddleware(IsAuth)
  async deleteGeolocation(@Arg('id', () => Int) id: number): Promise<any> {
    await Geolocation.delete(id);
    return true;
  }
}
