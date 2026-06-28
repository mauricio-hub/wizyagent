import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface ExchangeRatesResponse {
  rates: Record<string, number>;
}

@Injectable()
export class ConvertCurrenciesService {
  private readonly baseUrl = 'https://openexchangerates.org/api/latest.json';

  async convert(amount: number, from: string, to: string): Promise<number> {
    const response = await axios.get<ExchangeRatesResponse>(this.baseUrl, {
      params: {
        app_id: process.env.EXCHANGE_RATES_API_KEY?.trim(),
        symbols: `${from},${to}`,
      },
    });

    const rates = response.data.rates;
    const fromRate = rates[from.toUpperCase()];
    const toRate = rates[to.toUpperCase()];

    if (!fromRate || !toRate) {
      throw new Error(`Currency not found: ${from} or ${to}`);
    }

    return (amount / fromRate) * toRate;
  }
}
