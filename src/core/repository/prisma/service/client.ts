import { PrismaService } from 'src/core/repository/prisma/service/prisma.service';
import { PrismaClient } from 'src/generated/client';

const prismaClientSingleton = () => {
  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = new PrismaService();
  }
  return globalThis.prismaGlobal;
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

// Export the Prisma Client instance
const prismaMainClient = prismaClientSingleton();

export default prismaMainClient;
