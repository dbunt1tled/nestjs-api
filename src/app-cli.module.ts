import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import CoreModule from 'src/core/core.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionHandler } from 'src/handler';
import { Log } from 'src/core/logger/log';
import { ConfigApiModule } from 'src/core/config-api/config-api.module';
import { HashConfig } from 'src/core/config-api/hash.config';
import { UserModule } from 'src/app/user/user.module';
import { FileModule } from 'src/app/file/file.module';
import { TestCommand } from 'src/command/test.command';
import { RoleModule } from './app/role/role.module';

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
    CoreModule,
    UserModule,
    FileModule,
    RoleModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler,
    },
    Log,
    TestCommand,
  ],
})
export class AppCliModule {}
