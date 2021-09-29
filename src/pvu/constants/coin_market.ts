export interface Status {
  timestamp: Date;
  error_code: number;
  error_message?: any;
  elapsed: number;
  credit_count: number;
  notice?: any;
}

export interface USD {
  price: number;
  last_updated: Date;
}

export interface Quote {
  USD: USD;
}

export interface Data {
  id: number;
  symbol: string;
  name: string;
  amount: number;
  last_updated: Date;
  quote: Quote;
}

export interface CoinMarketResponse {
  status: Status;
  data: Data;
}
