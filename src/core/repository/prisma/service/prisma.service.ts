import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/client';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = `${process.env.DATABASE_URL}`;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
