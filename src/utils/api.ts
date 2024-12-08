import axios from "axios";
import { StockResponse } from "../types/StockData";

export const fetchStockData = async (
  symbol: string,
  startDate: string,
  endDate: string
): Promise<StockResponse> => {
  const response = await axios.get<StockResponse>(
    `https://bestchoice-serverless.netlify.app/.netlify/functions/get`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-target-url": `https://www.ibovfinancials.com/api/ibov/historical?symbol=azul4&token=${
          import.meta.env.VITE_API_KEY
        }&start_date=2024-09-02&end_date=2024-12-01&timeframe=1440`,
      },
      // params: {
      //   symbol: symbol.toLowerCase(),
      //   token,
      //   start_date: startDate,
      //   end_date: endDate,
      //   timeframe: 1440
      // }
    }
  );
  return response.data;
};
