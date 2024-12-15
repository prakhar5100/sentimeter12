import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl space-y-8"
    >
      <div className="bg-[#112240] p-8 rounded-lg shadow-xl">
        <div className="flex items-center space-x-8">
          <Skeleton circle width={120} height={120} baseColor="#233554" highlightColor="#64ffda" />
          <Skeleton width={400} height={24} baseColor="#233554" highlightColor="#64ffda" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#112240] p-8 rounded-lg shadow-xl">
          <Skeleton height={200} baseColor="#233554" highlightColor="#64ffda" />
        </div>
        <div className="bg-[#112240] p-8 rounded-lg shadow-xl">
          <Skeleton height={200} baseColor="#233554" highlightColor="#64ffda" />
        </div>
      </div>

      <div className="bg-[#112240] p-8 rounded-lg shadow-xl">
        <Skeleton height={300} baseColor="#233554" highlightColor="#64ffda" />
      </div>
    </motion.div>
  );
}