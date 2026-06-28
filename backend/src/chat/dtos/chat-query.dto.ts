import { ApiProperty } from '@nestjs/swagger';

export class ChatQueryDto {
  @ApiProperty({
    description: 'User query or question about products',
    example: 'Do you have any iPhones in stock?',
  })
  input!: string;

  @ApiProperty({
    description: 'OpenAI model to use (defaults to gpt-4.1)',
    example: 'gpt-4.1',
    required: false,
  })
  model?: string;
}