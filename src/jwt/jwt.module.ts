import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';

@Module({
  providers: [JwtService],
  imports: [
    NestJwtModule.register({
      secret: process.env.SERVER_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  exports: [JwtService],
})
export class JwtModule {}
