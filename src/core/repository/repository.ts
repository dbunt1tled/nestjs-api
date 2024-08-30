import { Filter } from 'src/core/repository/filter/filter';
import { Paginator } from 'src/core/repository/paginator';
import prismaMainClient from 'src/core/repository/prisma/service/client';
import { NotFound } from 'src/core/exception/not-found';
import { arrayWrap } from 'src/core/utils';

export class Repository<Entity> {
  public client = prismaMainClient;

  constructor(
    private readonly model: string,
    private readonly idField: string = 'id',
  ) {}

  async findById(id: string): Promise<Entity | null> {
    return this.client[this.model].findFirst({
      where: { [this.idField]: id },
      take: 1,
    });
  }

  async getById(id: string): Promise<Entity> {
    return this.client[this.model]
      .findUniqueOrThrow({
        where: { id: id },
      })
      .catch(() => {
        throw new NotFound(600002, `User Notify Message not found`);
      });
  }

  async one(filter: Filter): Promise<Entity | null> {
    return this.client[this.model].findFirst(filter.build(1));
  }

  async list(filter: Filter): Promise<Entity[] | Paginator<Entity>> {
    return this.resultList(filter);
  }

  async create(data: any): Promise<Entity> {
    return this.client[this.model].create({ data: data });
  }

  async update(data: any): Promise<Entity> {
    return this.client[this.model].update({
      where: {
        [this.idField]: data[this.idField],
      },
      data: data,
    });
  }

  async deleteCondition(
    condition: { [key: string]: any } | Array<{ [key: string]: any }>,
  ) {
    condition = arrayWrap(condition);
    await Promise.all(
      condition.map((c: any) =>
        this.client[this.model].deleteMany({ where: c }),
      ),
    );
  }

  async delete(id: string | string[]): Promise<number> {
    id = arrayWrap(id);
    const { count } = await this.client[this.model].deleteMany({
      where: {
        [this.idField]: {
          in: id,
        },
      },
    });

    return count;
  }

  async createManyAndReturn(data: any[]): Promise<Entity[]> {
    return this.client[this.model].createMany({ data: data });
  }

  private async resultList(
    filter: Filter,
  ): Promise<Entity[] | Paginator<Entity>> {
    if (
      !('pagination' in filter.options) ||
      filter.options.pagination === undefined ||
      filter.options.pagination.page === undefined
    ) {
      return this.client[this.model].findMany(filter.build());
    }
    const filterData = filter.build();
    filterData.orderBy = undefined;
    filterData.take = undefined;
    filterData.skip = undefined;

    const [data, count] = await Promise.all([
      this.client[this.model].findMany(filter.build()),
      this.client[this.model].count(filterData),
    ]);

    return <Paginator<Entity>>{
      data: data,
      included: {},
      meta: {
        total: data.length,
        page: filter.options.pagination.page,
        perPage: filter.options.pagination.limit,
        totalPage:
          count === 0 ? 1 : Math.ceil(count / filter.options.pagination.limit),
      },
    };
  }
}
