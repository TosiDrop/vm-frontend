export interface GetPricePairs {
  [key: string]: PricePair;
}

export interface PricePair {
  base_id: string;
  base_name: string;
  base_symbol: string;
  quote_id: string;
  quote_name: string;
  quote_symbol: string;
  last_price: string;
  base_volume: string;
  quote_volume: string;
}

// {"base_id":"29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c64d494e","base_name":"Minswap","base_symbol":"MIN","quote_id":"lovelace","quote_name":"Cardano","quote_symbol":"ADA","last_price":"0.037223255114525045971","base_volume":"2997752.472235","quote_volume":"111546.967"}
