import { Module } from '@nestjs/common';
import { CeidgService } from './ceidg.service';
import { CeidgController } from './ceidg.controller';

@Module({
  controllers: [CeidgController],
  providers: [CeidgService]
})
export class CeidgModule {}
