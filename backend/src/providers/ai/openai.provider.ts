// src/providers/ai/openai.provider.ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { AIProvider, AIResponse, Message, ToolCall } from './ai-provider.interface';

@Injectable()
export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(messages: Message[]): Promise<AIResponse> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
      tools: this.getTools(),
      tool_choice: 'auto',
    });

    const content = response.choices[0].message.content || '';
    const toolCalls = this.parseToolCalls(response.choices[0].message);

    return { content, toolCalls };
  }

  private getTools(): OpenAI.Chat.ChatCompletionTool[] {
    return [
      {
        type: 'function',
        function: {
          name: 'searchProducts',
          description: 'Search for products related to customer enquiry',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Product search query',
              },
            },
            required: ['query'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'convertCurrencies',
          description: 'Convert price from one currency to another',
          parameters: {
            type: 'object',
            properties: {
              amount: {
                type: 'number',
                description: 'Amount to convert',
              },
              from: {
                type: 'string',
                description: 'Source currency code (e.g., USD, EUR)',
              },
              to: {
                type: 'string',
                description: 'Target currency code (e.g., USD, EUR)',
              },
            },
            required: ['amount', 'from', 'to'],
          },
        },
      },
    ];
  }

  private parseToolCalls(message: OpenAI.Chat.ChatCompletionMessage): ToolCall[] | undefined {
    if (message.tool_calls) {
      return message.tool_calls.map((call) => ({
        id: call.id,
        name: call.function.name,
        arguments: JSON.parse(call.function.arguments),
      }));
    }
    return undefined;
  }
}
