import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  isComparison?: boolean;
}

export default function ProductForm({ onSubmit, isLoading, isComparison = false }: ProductFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="w-full max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Flipkart product URL"
          className="w-full px-6 py-4 rounded-lg bg-[#112240] border border-[#233554] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#64ffda] focus:border-transparent transition-all"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#64ffda] text-[#0a192f] px-6 py-2 rounded-md hover:bg-[#4fd1b3] transition-all disabled:bg-gray-400 font-medium flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0a192f]"></div>
              Analyzing...
            </>
          ) : (
            <>
              {isComparison ? <Sparkles size={20} /> : <Search size={20} />}
              <span>{isComparison ? 'Compare' : 'Analyze'}</span>
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}