export class ProductDto {
  displayTitle!: string;
  price!: string;
  imageUrl!: string;
  url!: string;
}

export class ConversionDto {
  from!: string;
  to!: string;
}

export class ChatResponseDto {
  response!: string;
  products?: ProductDto[];
  conversions?: ConversionDto[];
}
