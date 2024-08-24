import { CommandFactory } from 'nest-commander';
import { AppCliModule } from 'src/app-cli.module';

async function bootstrap() {
  await CommandFactory.run(AppCliModule, ['warn', 'error']);
}

bootstrap()
  .then(async (app) => {
    console.info('command bootstrapped ...!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(`server failed to start command`, err);
    process.exit(1);
  })
  .finally(() => {
    console.info('command exited ...!');
  });
