import {
  HydratedDocument,
  Model,
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
export class DBRepo<TDocument> {
  constructor(protected readonly Model: Model<TDocument>) {}

  async create(data: Partial<TDocument>): Promise<HydratedDocument<TDocument>> {
    return this.Model.create(data);
  }

  async findOne(
    filter: RootFilterQuery<TDocument>,
    select?: ProjectionType<TDocument>,
  ): Promise<HydratedDocument<TDocument> | null> {
    return this.Model.findOne(filter, select);
  }

  async find(
    filter: RootFilterQuery<TDocument>,
    select?: ProjectionType<TDocument>,
    options?: QueryOptions<TDocument>,
  ): Promise<HydratedDocument<TDocument>[]> {
    return this.Model.find(filter, select, options);
  }
  async paginate({
    filter,
    query,
    select,
    options,
  }: {
    filter: RootFilterQuery<TDocument>;
    query: { page: number; limit: number };
    select?: ProjectionType<TDocument>;
    options?: QueryOptions<TDocument>;
  }) {
    let { page = 1, limit = 10 } = query;

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;
    const finalOptions = { ...options, skip, limit };

    const [docs, totalDocs] = await Promise.all([
      this.Model.find(filter, select, finalOptions),
      this.Model.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      docs,
      currentPage: page,
      totalDocs,
      totalPages,
    };
  }
  async updateOne(
    filter: RootFilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<UpdateWriteOpResult> {
    return await this.Model.updateOne(filter, update);
  }

  async findOneAndUpdate(
    filter: RootFilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<HydratedDocument<TDocument> | null> {
    return await this.Model.findOneAndUpdate(filter, update, { new: true });
  }
  async findOneAndDelete(
    filter: RootFilterQuery<TDocument>,
  ): Promise<HydratedDocument<TDocument> | null> {
    return await this.Model.findOneAndDelete(filter);
  }
}
