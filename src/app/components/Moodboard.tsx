'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface MoodboardProps {
  images: string[];
  onRegenerate: (params: any) => void;
}

export default function Moodboard({ images, onRegenerate }: MoodboardProps) {
  const [filters, setFilters] = useState({
    colorTheme: 'all',
    vibe: 0.5,
    layout: 'messy'
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const gridLayouts = {
    messy: [
      { row: 1, col: 1, width: 2, height: 2, rotate: -5 },
      { row: 1, col: 3, width: 1, height: 1, rotate: 3 },
      { row: 2, col: 1, width: 1, height: 1, rotate: 2 },
      { row: 2, col: 2, width: 2, height: 2, rotate: -3 },
      { row: 3, col: 1, width: 2, height: 1, rotate: 4 },
      { row: 3, col: 3, width: 1, height: 1, rotate: -2 }
    ],
    balanced: [
      { row: 1, col: 1, width: 1, height: 1, rotate: 0 },
      { row: 1, col: 2, width: 1, height: 1, rotate: 0 },
      { row: 1, col: 3, width: 1, height: 1, rotate: 0 },
      { row: 2, col: 1, width: 1, height: 1, rotate: 0 },
      { row: 2, col: 2, width: 1, height: 1, rotate: 0 },
      { row: 2, col: 3, width: 1, height: 1, rotate: 0 }
    ]
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Color Theme:</label>
          <select
            value={filters.colorTheme}
            onChange={(e) => handleFilterChange('colorTheme', e.target.value)}
            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-gray-300"
          >
            <option value="all">All</option>
            <option value="warm">Warm</option>
            <option value="cool">Cool</option>
            <option value="pastel">Pastel</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Vibe:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={filters.vibe}
            onChange={(e) => handleFilterChange('vibe', parseFloat(e.target.value))}
            className="w-32"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Layout:</label>
          <select
            value={filters.layout}
            onChange={(e) => handleFilterChange('layout', e.target.value)}
            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-gray-300"
          >
            <option value="messy">Messy</option>
            <option value="balanced">Balanced</option>
          </select>
        </div>

        <button
          onClick={() => onRegenerate(filters)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Regenerate
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 relative">
        {images.map((image, index) => {
          const layout = gridLayouts[filters.layout as keyof typeof gridLayouts][index];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-lg shadow-lg"
              style={{
                gridColumn: `span ${layout.width}`,
                gridRow: `span ${layout.height}`,
                transform: `rotate(${layout.rotate}deg)`
              }}
            >
              <Image
                src={image}
                alt={`Moodboard image ${index + 1}`}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 