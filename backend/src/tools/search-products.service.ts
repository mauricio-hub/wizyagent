import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

export interface Product {
  displayTitle: string;
  embeddingText: string;
  url: string;
  imageUrl: string;
  productType: string;
  discount: string;
  price: string;
  variants: string;
}

@Injectable()
export class SearchProductsService {
  private readonly csvPath = path.join(process.cwd(), 'data', 'Full Stack Test products_list.csv');

  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.loadProducts();
    const keywords = query.toLowerCase().split(' ');

    const scored = products.map((product) => {
      const text = `${product.displayTitle} ${product.embeddingText}`.toLowerCase();
      const score = keywords.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
      return { product, score };
    });

    return scored
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(({ product }) => product);
  }

  private loadProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      const products: Product[] = [];
      fs.createReadStream(this.csvPath)
        .pipe(csv())
        .on('data', (row: Product) => products.push(row))
        .on('end', () => resolve(products))
        .on('error', reject);
    });
  }
}
