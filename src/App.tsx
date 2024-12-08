import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import DataForm from './components/DataForm';
import StockChart from './components/StockChart';
import { fetchStockData } from './utils/api';
import { predictWithNeuralNetwork, predictWithChaosTheory } from './utils/predictions';
import { StockDataPoint } from './types/StockData';

function App() {
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [neuralPredictions, setNeuralPredictions] = useState<number[]>([]);
  const [chaosPredictions, setChaosPredictions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (symbol: string, startDate: string, endDate: string) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetchStockData(symbol, startDate, endDate);
      const data = response[symbol.toUpperCase()];
      
      if (!data || data.length === 0) {
        throw new Error('No data available for the selected period');
      }

      setStockData(data);
      
      // Generate predictions
      const neural = predictWithNeuralNetwork(data);
      const chaos = predictWithChaosTheory(data);
      
      setNeuralPredictions(neural);
      setChaosPredictions(chaos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Stock Price Predictor
            </h1>
          </div>
          <p className="text-gray-600">
            Analyze historical stock data and predict future prices using Neural Networks and Chaos Theory
          </p>
        </div>

        <DataForm onSubmit={handleSubmit} />

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {stockData.length > 0 && !loading && (
          <div className="space-y-6">
            <StockChart
              data={stockData}
              neuralPredictions={neuralPredictions}
              chaosPredictions={chaosPredictions}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Neural Network Prediction</h3>
                <p className="text-gray-600">
                  Next predicted price: {neuralPredictions[0]?.toFixed(2)}
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Chaos Theory Prediction</h3>
                <p className="text-gray-600">
                  Next predicted price: {chaosPredictions[0]?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;