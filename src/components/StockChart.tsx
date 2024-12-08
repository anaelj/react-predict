import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { StockDataPoint } from '../types/StockData';

interface StockChartProps {
  data: StockDataPoint[];
  neuralPredictions: number[];
  chaosPredictions: number[];
}

const StockChart: React.FC<StockChartProps> = ({
  data,
  neuralPredictions,
  chaosPredictions
}) => {
  const chartData = [
    ...data.map((point) => ({
      date: format(parseISO(point.time.replace('.', '-')), 'MMM dd'),
      price: point.close,
    })),
    ...neuralPredictions.map((price, index) => ({
      date: `Prediction ${index + 1}`,
      neuralPrice: price,
    })),
    ...chaosPredictions.map((price, index) => ({
      date: `Prediction ${index + 1}`,
      chaosPrice: price,
    })),
  ];

  return (
    <div className="w-full h-[500px] bg-white p-4 rounded-lg shadow-md">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            name="Historical"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="neuralPrice"
            stroke="#dc2626"
            name="Neural Network Prediction"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="chaosPrice"
            stroke="#16a34a"
            name="Chaos Theory Prediction"
            strokeWidth={2}
            strokeDasharray="3 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;