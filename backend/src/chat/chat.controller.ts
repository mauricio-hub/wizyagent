import { Body, Controller, Post, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatQueryDto } from './dtos/chat-query.dto';
import { ChatResponseDto, ProductDto } from './dtos/chat-response.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() payload: ChatQueryDto): Promise<ChatResponseDto> {
    if (!payload.input || !payload.input.trim()) {
      throw new BadRequestException('Input cannot be empty');
    }

    try {
      const result = await this.chatService.chat(payload);

      const products: ProductDto[] = result.products.map((p: any) => ({
        displayTitle: p.displayTitle,
        price: p.price,
        imageUrl: p.imageUrl,
        url: p.url,
      }));

      return {
        response: result.text,
        products: products.length > 0 ? products : undefined,
        conversions: result.conversions.length > 0 ? result.conversions : undefined,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to process chat request');
    }
  }
}
