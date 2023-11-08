import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EmailsModule } from './emails/emails.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { throttleJSON } from 'configs';
import { BullModule } from '@nestjs/bull';
import { redisStore } from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { CloudinaryModule } from './cloundinary/cloundinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      entities: ['dist/entities/*.js'],
      migrations: ['dist/migrations/*.js'],
    }),
    ThrottlerModule.forRoot(throttleJSON),
    CacheModule.registerAsync({
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      useFactory: async () => {
        return {
          store: await redisStore({
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
          }),
        }; 
      },
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    // HttpModule.register({
    //   timeout: 5000,
    //   maxRedirects: 5,
    // }),
    UsersModule,
    RolesModule,
    AuthModule,
    EmailsModule,
    BooksModule,
    CategoriesModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
