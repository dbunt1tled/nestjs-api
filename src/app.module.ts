import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from 'src/app/file/file.module';
import CoreModule from 'src/core/core.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionHandler } from 'src/handler';
import { Log } from 'src/core/logger/log';
import { FastifyMulterModule, MulterOptions } from '@nest-lab/fastify-multer';
import { configMiddleware } from 'src/middleware.configure';
import { HealthModule } from 'src/app/health/health.module';
import { HashConfig } from 'src/core/config-api/hash.config';
import { ConfigApiModule } from 'src/core/config-api/config-api.module';
import { UserModule } from 'src/app/user/user.module';
import { RoleModule } from 'src/app/role/role.module';
import { IsUniqueDBConstraint } from 'src/core/constraint/is-unique-db.constraint';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
      cache: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigApiModule],
      useFactory: (hashConfig: HashConfig) => ({
        privateKey: hashConfig.privateKey,
        publicKey: hashConfig.publicKey,
        signOptions: {
          algorithm: hashConfig.jwtAlgorithm,
        },
      }),
      inject: [HashConfig],
    }),
    FastifyMulterModule.registerAsync({
      useFactory: (): MulterOptions => {
        return {};
      },
    }),
    CoreModule,
    FileModule,
    HealthModule,
    UserModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler,
    },
    IsUniqueDBConstraint,
    AppService,
    Log,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    configMiddleware(consumer);
  }
}
