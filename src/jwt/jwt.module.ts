import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './guards/jwt.strategy';
import { JwtService } from './jwt.service';

@Module({
  providers: [JwtService, JwtStrategy],
  imports: [
    NestJwtModule.register({
      secret: process.env.SERVER_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    UserModule,
  ],
  exports: [JwtService],
})
export class JwtModule {}
