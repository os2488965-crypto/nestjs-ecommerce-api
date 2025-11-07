import {
  HydratedDocument,
  Model,
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
export class DBRepo<TDcoument> {
  constructor(protected readonly Model: Model<TDcoument>) {}

  async create(data: Partial<TDcoument>): Promise<HydratedDocument<TDcoument>> {
    return this.Model.create(data);
  }

  async findOne(
    filter: RootFilterQuery<TDcoument>,
    select?: ProjectionType<TDcoument>,
  ): Promise<HydratedDocument<TDcoument> | null> {
    return this.Model.findOne(filter, select);
  }

  async find(
    filter: RootFilterQuery<TDcoument>,
    select?: ProjectionType<TDcoument>,
    options?: QueryOptions<TDcoument>,
  ): Promise<HydratedDocument<TDcoument>[]> {
    return this.Model.find(filter, select, options);
  }

  async paginate({
    filter,
    query,
    select,
    options,
  }: {
    filter: RootFilterQuery<TDcoument>;
    query: { page: number; limit: number };
    select?: ProjectionType<TDcoument>;
    options?: QueryOptions<TDcoument>;
  }) {
    // eslint-disable-next-line prefer-const
    let { page, limit } = query;

    if (page < 1) page = 1;
    page = page * 1 || 1;

    const skip = (page - 1) * limit;
    const finalOptions = {
      ...options,
      skip,
      limit,
    };

    const docs = await this.Model.find(filter, select, finalOptions);
    return { docs, currentPage: page };
  }

  async updateOne(
    filter: RootFilterQuery<TDcoument>,
    update: UpdateQuery<TDcoument>,
  ): Promise<UpdateWriteOpResult> {
    return await this.Model.updateOne(filter, update);
  }

  async findOneAndUpdate(
    filter: RootFilterQuery<TDcoument>,
    update: UpdateQuery<TDcoument>,
    options: QueryOptions<TDcoument> | null = null,
  ): Promise<HydratedDocument<TDcoument> | null> {
    return await this.Model.findOneAndUpdate(filter, update, options);
  }
}
