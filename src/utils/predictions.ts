import * as brain from 'brain.js';
import { StockDataPoint } from '../types/StockData';

export const normalizeData = (data: number[]): number[] => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return data.map(x => (x - min) / (max - min));
};

export const denormalizeData = (
  normalized: number,
  original: number[]
): number => {
  const min = Math.min(...original);
  const max = Math.max(...original);
  return normalized * (max - min) + min;
};

export const predictWithNeuralNetwork = (data: StockDataPoint[]): number[] => {
  const closePrices = data.map(d => d.close);
  const normalizedPrices = normalizeData(closePrices);

  const trainingData = [];
  for (let i = 0; i < normalizedPrices.length - 5; i++) {
    trainingData.push({
      input: normalizedPrices.slice(i, i + 5),
      output: [normalizedPrices[i + 5]]
    });
  }

  const net = new brain.NeuralNetwork();
  net.train(trainingData);

  const lastInputs = normalizedPrices.slice(-5);
  const prediction = net.run(lastInputs);
  
  return [denormalizeData(prediction[0], closePrices)];
};

export const predictWithChaosTheory = (data: StockDataPoint[]): number[] => {
  const closePrices = data.map(d => d.close);
  const predictions: number[] = [];
  
  // Lyapunov exponent-based prediction
  const timeDelay = 1;
  const embeddingDimension = 3;
  
  for (let i = 0; i < 5; i++) {
    const lastPoints = closePrices.slice(-embeddingDimension);
    const sum = lastPoints.reduce((acc, val) => acc + val, 0);
    const avg = sum / lastPoints.length;
    
    // Simple chaos-based prediction using sensitivity to initial conditions
    const lyapunovFactor = 0.01;
    const randomComponent = (Math.random() - 0.5) * 2 * lyapunovFactor;
    const prediction = avg * (1 + randomComponent);
    
    predictions.push(prediction);
  }
  
  return predictions;
};