import { HttpException, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RavenInterceptor } from 'nest-raven';
import { AuthModule } from './auth/auth.module';
import { PerformanceInterceptor } from './common/interceptors/performance-interceptor/performance-interceptor';
import { JwtModule } from './jwt/jwt.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { SaleModule } from './sale/sale.module';
import { SocketsModule } from './sockets/sockets.module';
import { NotificationModule } from './notification/notification.module';
import { CeidgModule } from './ceidg/ceidg.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ConfigModule.forRoot(),
    AuthModule,
    JwtModule,
    SaleModule,
    SocketsModule,
    NotificationModule,
    CeidgModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor({
        request: true,
        transaction: true,
        filters: [
          {
            type: HttpException,
            filter: (exception: HttpException) => exception.getStatus() < 500,
          },
        ],
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
  ],
})
export class AppModule {}
