import { configDotenv } from 'dotenv';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import { EnvironmentKey } from '../../src/shared/enums/environment.enum';
import { ExecuteTransactionTypeSeed } from './transaction-type.seed';

configDotenv();

function main() {
  const DATABASE_URL = `postgresql://${process.env[EnvironmentKey.DB_USER]}:${process.env[EnvironmentKey.DB_PASSWORD]}@${process.env[EnvironmentKey.DB_HOST]}:${process.env[EnvironmentKey.DB_PORT]}/${process.env[EnvironmentKey.DB_NAME]}?schema=public`;

  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: DATABASE_URL,
      debug: true,
    }),
  });

  Promise.all([ExecuteTransactionTypeSeed(prisma)])
    .then(() => {
      console.log('Success to execute seeds! 🎉🎊🚀');
    })
    .catch(console.error)
    .finally(async () => {
      await prisma.$disconnect();
    });
}

main();
