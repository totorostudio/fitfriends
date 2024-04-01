/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClientService } from '../prisma/prisma-client.service';

import { DefaultPojoType, Entity, EntityIdType } from './entity.interface';
import { Repository } from './repository.interface';

export abstract class BasePostgresRepository<
  EntityType extends Entity<EntityIdType, DocumentType>,
  DocumentType = DefaultPojoType,
  > implements Repository<EntityType, DocumentType> {

  constructor(
    protected readonly client: PrismaClientService,
    private readonly createEntity: (document: DocumentType) => EntityType,
  ) {}

  protected createEntityFromDocument(document: DocumentType): EntityType | null {
    if (! document) {
      return null;
    }

    return this.createEntity(document);
  }

  protected async findOne(model: string, where: object): Promise<EntityType | null> {
    return this.client[model].findUnique({ where });
  }

  public async findById(id: EntityType['id']): Promise<EntityType | null> {
    throw new Error('Not implemented');
  }

  public async save(entity: EntityType): Promise<EntityType> {
    throw new Error('Not implemented');
  }

  public async update(id: EntityType['id'], entity: EntityType): Promise<EntityType> {
    throw new Error('Not implemented');
  }

  public async deleteById(id: EntityType['id']): Promise<void> {
    throw new Error('Not implemented');
  }

}
