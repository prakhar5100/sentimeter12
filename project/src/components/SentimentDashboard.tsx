import { motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import ReactWordcloud from 'react-wordcloud';
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

interface SentimentDashboardProps {
  data: {
    overallSentiment: number;
    sentimentBreakdown: {
      positive: number;
      negative: number;
      neutral: number;
    };
    topKeywords: { word: string; count: number }[];
    geographicalData: { location: string; sentiment: number }[];
  };
  details: {
    title: string;
    src: string;
  };
  summary: string;
}

export default function SentimentDashboard({ data, details, summary }: SentimentDashboardProps) {
  const wordcloudData = data.topKeywords.map(({ word, count }) => ({
    text: word,
    value: count,
  }));

  const doughnutData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [
          data.sentimentBreakdown.positive,
          data.sentimentBreakdown.negative,
          data.sentimentBreakdown.neutral,
        ],
        backgroundColor: ['#64ffda', '#ff6b6b', '#94a3b8'],
      },
    ],
  };

  const barData = {
    labels: data.geographicalData.map((item) => item.location),
    datasets: [
      {
        label: 'Sentiment Score by Location',
        data: data.geographicalData.map((item) => item.sentiment),
        backgroundColor: '#64ffda',
      },
    ],
  };

  const chartOptions = {
    plugins: {
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
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#112240] p-8 rounded-lg shadow-xl flex items-center justify-between"
      >
        <img src={details.src} alt="" className="w-48 h-48 object-contain rounded-lg" />
        <h1 className="ml-8 font-medium text-xl flex-1">{details.title}</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#112240] p-8 rounded-lg shadow-xl"
        >
          <h2 className="text-xl font-semibold mb-6 flex justify-center">Overall Sentiment</h2>
          <div className="flex items-center justify-center h-[80%]">
            <div className="relative">
              <svg className="w-48 h-48">
                <circle
                  className="text-[#233554]"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="88"
                  cx="96"
                  cy="96"
                />
                <circle
                  className="text-[#64ffda]"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="88"
                  cx="96"
                  cy="96"
                  strokeDasharray={`${2 * Math.PI * 58 * data.overallSentiment} ${
                    2 * Math.PI * 88 * (1 - data.overallSentiment)
                  }`}
                  strokeDashoffset={2 * Math.PI * 88 * 0.25}
                />
              </svg>
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                {(data.overallSentiment * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#112240] p-8 rounded-lg shadow-xl"
        >
          <h2 className="text-xl font-semibold mb-6 flex justify-center">Sentiment Distribution</h2>
          <div className="h-64 flex justify-center">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#112240] p-8 rounded-lg shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-6 flex justify-center">Geographical Analysis</h2>
        <div className="h-80 w-full flex justify-center">
          <Bar data={barData} options={chartOptions} />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#112240] p-8 rounded-lg shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-6 flex justify-center">Word Cloud</h2>
        <div className="h-64 flex justify-center">
          <ReactWordcloud
            words={wordcloudData}
            options={{
              colors: ['#64ffda', '#4fd1b3', '#38a89d'],
              fontFamily: 'Inter',
              fontSizes: [30, 90],
              rotations: 0,
            }}
          />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#112240] p-8 rounded-lg shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-6 flex justify-center">Summary</h2>
        <p className="text-lg leading-relaxed leading-1 tracking-wide">{summary}</p>
      </motion.div>
    </div>
  );
}