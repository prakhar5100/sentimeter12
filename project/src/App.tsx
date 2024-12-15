import { useState } from 'react';
import { BarChart3, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductForm from './components/ProductForm';
import SentimentDashboard from './components/SentimentDashboard';
import ComparisonView from './components/ComparisonView';
import LoadingState from './components/LoadingState';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [summary, setSummary] = useState('');
  const [details, setDetails] = useState({ title: '', src: '' });
  const [mode, setMode] = useState('single'); // 'single' or 'compare'

  const handleAnalyze = async (url: string, isComparison = false) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      
      if (isComparison) {
        setComparisonData(data);
      } else {
        setAnalysisData(data.analysis);
        setSummary(data.reviews);
        setDetails({ title: data.title, src: data.imageURL });
      }
    } catch (error) {
      console.error('Error analyzing product:', error);
    } finally {
      setIsLoading(false);
      return true
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-white">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#112240] shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-[#64ffda]" size={28} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#64ffda] to-[#0a9396] bg-clip-text text-transparent">
                Sentimeter
              </h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setMode('single')}
                className={`px-4 py-2 rounded-md transition-all ${
                  mode === 'single'
                    ? 'bg-[#64ffda] text-[#0a192f]'
                    : 'text-[#64ffda] border border-[#64ffda]'
                }`}
              >
                Single Analysis
              </button>
              <button
                onClick={() => setMode('compare')}
                className={`px-4 py-2 rounded-md transition-all ${
                  mode === 'compare'
                    ? 'bg-[#64ffda] text-[#0a192f]'
                    : 'text-[#64ffda] border border-[#64ffda]'
                }`}
              >
                Compare Products
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-10"
        >
          {mode === 'single' ? (
            <>
              <ProductForm onSubmit={handleAnalyze} isLoading={isLoading} />
              {isLoading && <LoadingState />}
              {analysisData && !isLoading && (
                <SentimentDashboard 
                  data={analysisData} 
                  details={details} 
                  summary={summary}
                />
              )}
            </>
          ) : (
            <ComparisonView 
              onAnalyze={handleAnalyze}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default App;