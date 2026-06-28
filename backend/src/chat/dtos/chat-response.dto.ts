import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ example: 'iPhone 12' })
  displayTitle!: string;

  @ApiProperty({ example: '900.0 USD' })
  price!: string;

  @ApiProperty({ example: 'https://cdn.shopify.com/...' })
  imageUrl!: string;

  @ApiProperty({ example: 'https://wizybot-demo-store.myshopify.com/products/iphone-12' })
  url!: string;
}

export class ConversionDto {
  @ApiProperty({ example: '900 USD' })
  from!: string;

  @ApiProperty({ example: '790.20 EUR' })
  to!: string;
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'Final LLM response to the user query',
    example: 'Yes, we have iPhones in stock...',
  })
  response!: string;

  @ApiProperty({
    type: [ProductDto],
    required: false,
    description: 'Related products found by searchProducts tool',
  })
  products?: ProductDto[];

  @ApiProperty({
    type: [ConversionDto],
    required: false,
    description: 'Currency conversions performed by convertCurrencies tool',
  })
  conversions?: ConversionDto[];
}
