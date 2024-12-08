export interface StockDataPoint {
  time: string;
  open: number;
  low: number;
  high: number;
  close: number;
  tick_volume: number;
  real_volume: number;
}

export interface StockResponse {
  [symbol: string]: StockDataPoint[];
}