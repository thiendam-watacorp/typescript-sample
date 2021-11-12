import { Resolver, Query, Mutation, Arg, Int, UseMiddleware } from 'type-graphql';
import { IsAuth } from '../../../infrastructure/middleware/is-auth';
import { Catalog } from '../../entities/catalog';
import { CatalogInput } from '../inputs/catalog';

@Resolver()
export class CatalogResolver {
  @Query(() => [Catalog], { description: 'Get all catalog' })
  @UseMiddleware(IsAuth)
  async catalogsList(): Promise<Catalog[]> {
    const catalogs = await Catalog.find();
    return catalogs;
  }

  @Mutation(() => Catalog, { description: 'Create catalog' })
  @UseMiddleware(IsAuth)
  async createCatalog(@Arg('fields', () => CatalogInput) fields: CatalogInput): Promise<Catalog> {
    const catalog = Catalog.create(fields);
    await catalog.save();
    return catalog;
  }

  @Mutation(() => Catalog, { description: 'Update catalog' })
  @UseMiddleware(IsAuth)
  async updateCatalog(
    @Arg('id', () => Int) id: number,
    @Arg('fields', () => CatalogInput) fields: CatalogInput,
  ): Promise<any> {
    const catalog = await Catalog.update({ id }, fields);
    return catalog;
  }

  @Mutation(() => Boolean, { description: 'Delete catalog' })
  @UseMiddleware(IsAuth)
  async deleteCatalog(@Arg('id', () => Int) id: number): Promise<any> {
    await Catalog.delete(id);
    return true;
  }

  @Mutation(() => Boolean, { description: 'Soft remove catalog' })
  @UseMiddleware(IsAuth)
  async removeCatalog(@Arg('id', () => Int) id: number): Promise<any> {
    const catalog = await Catalog.findOne({ where: { id } });
    if (catalog) {
      const result = await Catalog.softRemove(catalog);
      return !!result.deletedAt;
    } else {
      return false;
    }
  }
}
