import { Module } from '@nestjs/common';
import { Web3Service } from './services/web3.service';

@Module({
  imports: [],
  controllers: [],
  providers: [Web3Service],
  exports: [Web3Service],
})
export class Web3Module {}
