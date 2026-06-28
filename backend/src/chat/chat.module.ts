import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SearchProductsService } from '../tools/search-products.service';
import { ConvertCurrenciesService } from '../tools/convert-currencies.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, SearchProductsService, ConvertCurrenciesService],
})
export class ChatModule {}
