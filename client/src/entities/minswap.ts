export namespace MinswapTypes {
  export interface PriceInfoMap {
    [key: string]: PriceInfo;
  }

  export interface PriceInfo {
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
}
