/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatQueryDto } from './dtos/chat-query.dto';
import { SearchProductsService } from '../tools/search-products.service';
import { ConvertCurrenciesService } from '../tools/convert-currencies.service';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  private readonly tools: OpenAI.Responses.Tool[] = [
    {
      type: 'function',
      name: 'searchProducts',
      description: 'Search for products related to the customer enquiry. Returns up to 2 relevant products.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query based on customer enquiry' },
        },
        required: ['query'],
        additionalProperties: false,
      },
      strict: true,
    },
    {
      type: 'function',
      name: 'convertCurrencies',
      description: 'Convert a price from one currency to another using live exchange rates.',
      parameters: {
        type: 'object',
        properties: {
          amount: { type: 'number', description: 'Amount to convert' },
          from: { type: 'string', description: 'Source currency code (e.g. USD)' },
          to: { type: 'string', description: 'Target currency code (e.g. EUR)' },
        },
        required: ['amount', 'from', 'to'],
        additionalProperties: false,
      },
      strict: true,
    },
  ];

  constructor(
    private readonly searchProductsService: SearchProductsService,
    private readonly convertCurrenciesService: ConvertCurrenciesService,
  ) {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async chat(
    payload: ChatQueryDto,
  ): Promise<{ text: string; products: object[]; conversions: Array<{ from: string; to: string }> }> {
    const systemPrompt = `You are a helpful product shopping assistant. Your role is to help users find products.
IMPORTANT: For ANY product-related query, ALWAYS use the searchProducts tool first to find relevant products.
When the user asks about products, searches, or wants to see items, use searchProducts immediately.
Present the results naturally in your response WITHOUT including URLs, links, or raw data. The products will be displayed as cards with images and details.
Ask which product they're interested in or if they want to convert prices.
You can also convert prices between currencies using convertCurrencies tool when asked.
NEVER include URLs or links in your text response - let the product cards handle that.
Be proactive in using search tools - never apologize for not finding products, search for what the user is asking about.`;

    const input: OpenAI.Responses.ResponseInputItem[] = [
      { role: 'user', content: systemPrompt },
      { role: 'user', content: payload.input },
    ];

    const trackedProducts: object[] = [];
    const trackedConversions: Array<{ from: string; to: string }> = [];

    const model = payload.model || 'gpt-4.1';

    let response = await this.openai.responses.create({
      model,
      tools: this.tools,
      input,
    });

    input.push(...response.output);

    while (response.output.some((item) => (item as any).type === 'function_call')) {

      for (const item of response.output) {
        if (item.type !== 'function_call') continue;

        const args = JSON.parse(item.arguments);
        let output = '';

        if (item.name === 'searchProducts') {
          const products = await this.searchProductsService.searchProducts(args.query);
          trackedProducts.push(...products);
          output = JSON.stringify(products);
        } else if (item.name === 'convertCurrencies') {
          const converted = await this.convertCurrenciesService.convert(args.amount, args.from, args.to);
          const conversionStr = `${converted.toFixed(2)} ${args.to.toUpperCase()}`;
          trackedConversions.push({
            from: `${args.amount} ${args.from.toUpperCase()}`,
            to: conversionStr,
          });
          output = conversionStr;
        }

        input.push({ type: 'function_call_output', call_id: item.call_id, output });
      }

      response = await this.openai.responses.create({
        model,
        tools: this.tools,
        input,
      });

      input.push(...response.output);
    }

    const messageItem = response.output.find((item) => (item as any).type === 'message');
    const text = messageItem
      ? (((messageItem as any).content?.find((c: any) => c.type === 'output_text')?.text) || '')
      : '';

    return {
      text,
      products: trackedProducts,
      conversions: trackedConversions,
    };
  }
}
