import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatQueryDto } from './dtos/chat-query.dto';



@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }
    this.openai = new OpenAI({
      apiKey,
    });
  }

  async chat(payload: ChatQueryDto): Promise<string> {
    try {
      const response = await this.openai.responses.create({
        model: payload.model,
        input: payload.input,
      });
      return response.output_text;
    } catch (error) {
      console.error('OpenAI Error:', JSON.stringify(error, null, 2));
      throw error;
    }
  }
}