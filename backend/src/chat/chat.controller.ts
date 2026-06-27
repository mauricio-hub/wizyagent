// src/chat/chat.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatQueryDto } from './dtos/chat-query.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() payload: ChatQueryDto): Promise<{ response: string }> {
    const response = await this.chatService.chat(payload);
    return { response };
  }
}
