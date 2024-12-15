import { useState } from 'react';
import { motion } from 'framer-motion';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import ProductForm from './ProductForm';
import LoadingState from './LoadingState';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);


interface ComparisonViewProps {
  onAnalyze: (url: string, isComparison: boolean) => void;
}

export default function ComparisonView({ onAnalyze }: ComparisonViewProps) {
  const [product1Data, setProduct1Data] = useState(null);
  const [product2Data, setProduct2Data] = useState(null);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  const handleProduct1Submit = async (url: string) => {
    setIsLoading1(true);
    try {
      const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setProduct1Data(data);
    } catch (error) {
      console.error('Error analyzing product 1:', error);
    } finally {
      setIsLoading1(false);
    }
  };

  const handleProduct2Submit = async (url: string) => {
    setIsLoading2(true);
    try {
      const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setProduct2Data(data);
    } catch (error) {
      console.error('Error analyzing product 2:', error);
    } finally {
      setIsLoading2(false);
    }
  };

  const showComparison = product1Data && product2Data && !isLoading1 && !isLoading2;

  return (
    <div className="w-full max-w-6xl space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4 text-[#64ffda]">Product 1</h3>
          <ProductForm onSubmit={handleProduct1Submit} isLoading={isLoading1} isComparison />
          {product1Data && !isLoading1 && (
            <div className="mt-4 text-sm text-[#64ffda]">✓ Product 1 analyzed</div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4 text-[#64ffda]">Product 2</h3>
          <ProductForm onSubmit={handleProduct2Submit} isLoading={isLoading2} isComparison />
          {product2Data && !isLoading2 && (
            <div className="mt-4 text-sm text-[#64ffda]">✓ Product 2 analyzed</div>
          )}
        </div>
      </div>

      {(isLoading1 || isLoading2) && <LoadingState />}

      {!showComparison && !isLoading1 && !isLoading2 && (product1Data || product2Data) && (
        <div className="text-center text-[#64ffda] mt-8">
          Please analyze both products to see the comparison
        </div>
      )}

      {showComparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="bg-[#112240] p-8 rounded-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-6">Visual Comparison</h2>
              <ReactCompareSlider
                itemOne={
                  <ReactCompareSliderImage
                    src={product1Data.imageURL}
                    alt="Product 1"
                    style={{
                      objectFit: 'contain',
                      width: '500px',
                      height: '100%',
                      borderRadius: '8px',
                      padding: '20px'
                    }}
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={product2Data.imageURL}
                    alt="Product 2"
                    style={{
                      objectFit: 'contain',
                      width: '500px',
                      height: '100%',
                      borderRadius: '8px',
                      padding: '20px',
                      position: 'absolute',
                      right : '0'
                    }}
                  />
                }
                className="h-96 rounded-lg overflow-hidden bg-black"
              />
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#112240] p-8 rounded-lg shadow-xl flex flex-col justify-around">
              <h3 className="text-xl font-semibold mb-4">{product1Data.title}</h3>
              <div className="space-y-4">
                <p className="text-[#64ffda] font-medium">
                  Sentiment Score: {(product1Data.analysis.overallSentiment * 100).toFixed(1)}%
                </p>
                <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-[#112240] p-8 rounded-lg shadow-xl"
                        >
                          <h2 className="text-xl font-semibold mb-6">Sentiment Distribution</h2>
                          <div className="h-64">
                            <Doughnut data={
                              {
                                labels: ['Positive', 'Negative', 'Neutral'],
                                datasets: [
                                  {
                                    data: [
                                      product1Data.analysis.sentimentBreakdown.positive,
                                      product1Data.analysis.sentimentBreakdown.negative,
                                      product1Data.analysis.sentimentBreakdown.neutral,
                                    ],
                                    backgroundColor: ['#64ffda', '#ff6b6b', '#94a3b8'],
                                  },
                                ],
                              }
                            } options={
                              {plugins: {
                                legend: {
                                  labels: {
                                    color: '#fff',
                                  },
                                },
                              },
                              scales: {
                                y: {
                                  ticks: { color: '#fff' },
                                  grid: { color: '#233554' },
                                },
                                x: {
                                  ticks: { color: '#fff' },
                                  grid: { color: '#233554' },
                                },
                              },}
                            } />
                          </div>
                        </motion.div>
                
                <p className="text-gray-300">{product1Data.reviews}</p>
              </div>
            </div>
            <div className="bg-[#112240] p-8 rounded-lg shadow-xl flex flex-col justify-around">
              <h3 className="text-xl font-semibold mb-4">{product2Data.title}</h3>
              <div className="space-y-4">
                <p className="text-[#64ffda] font-medium">
                  Sentiment Score: {(product2Data.analysis.overallSentiment * 100).toFixed(1)}%
                </p>

                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-[#112240] p-8 rounded-lg shadow-xl"
                        >
                          <h2 className="text-xl font-semibold mb-6">Sentiment Distribution</h2>
                          <div className="h-64">
                            <Doughnut data={
                              {
                                labels: ['Positive', 'Negative', 'Neutral'],
                                datasets: [
                                  {
                                    data: [
                                      product2Data.analysis.sentimentBreakdown.positive,
                                      product2Data.analysis.sentimentBreakdown.negative,
                                      product2Data.analysis.sentimentBreakdown.neutral,
                                    ],
                                    backgroundColor: ['#64ffda', '#ff6b6b', '#94a3b8'],
                                  },
                                ],
                              }
                            } options={
                              {plugins: {
                                legend: {
                                  labels: {
                                    color: '#fff',
                                  },
                                },
                              },
                              scales: {
                                y: {
                                  ticks: { color: '#fff' },
                                  grid: { color: '#233554' },
                                },
                                x: {
                                  ticks: { color: '#fff' },
                                  grid: { color: '#233554' },
                                },
                              },}
                            } />
                          </div>
                        </motion.div>
                
                <p className="text-gray-300">{product2Data.reviews}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}