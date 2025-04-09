'use client';

import { useState } from 'react';
import Chatbot from './components/Chatbot';
import Moodboard from './components/Moodboard';
import { motion, AnimatePresence } from 'framer-motion';
import { generateImages, regenerateImages } from './utils/imageGenerator';
import { useAuth } from './context/AuthContext';
import { saveMoodboard } from './utils/storage';
import { toast } from 'react-hot-toast';

export default function Home() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [showMoodboard, setShowMoodboard] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [finalPrompt, setFinalPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    colorTheme: 'all',
    vibe: 0.5,
    layout: 'messy'
  });

  const handleGenerateMoodboard = async (prompt: string) => {
    setFinalPrompt(prompt);
    setIsGenerating(true);
    try {
      // Generate multiple images sequentially
      const generatedImages: string[] = [];
      for (let i = 0; i < 4; i++) {
        const image = await generateImages(prompt);
        generatedImages.push(...image);
      }
      setImages(generatedImages);
      setShowMoodboard(true);
    } catch (error) {
      console.error('Error generating images:', error);
      toast.error('Failed to generate images. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async (filters: any) => {
    setIsGenerating(true);
    setCurrentFilters(filters);
    try {
      // Regenerate multiple images sequentially
      const regeneratedImages: string[] = [];
      for (let i = 0; i < 4; i++) {
        const image = await regenerateImages(finalPrompt, filters);
        regeneratedImages.push(...image);
      }
      setImages(regeneratedImages);
    } catch (error) {
      console.error('Error regenerating images:', error);
      toast.error('Failed to regenerate images. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save your moodboard');
      return;
    }

    try {
      await saveMoodboard(user.uid, {
        images,
        prompt: finalPrompt,
        filters: currentFilters,
        timestamp: Date.now()
      });
      toast.success('Moodboard saved successfully!');
    } catch (error) {
      console.error('Error saving moodboard:', error);
      toast.error('Failed to save moodboard. Please try again.');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100" />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-800"
          >
            Moodboard Generator
          </motion.h1>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {user.displayName}</span>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save Moodboard
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign in with Google
            </button>
          )}
        </div>

        <AnimatePresence>
          {!showMoodboard ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Chatbot onGenerate={handleGenerateMoodboard} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Moodboard
                images={images}
                onRegenerate={handleRegenerate}
                isGenerating={isGenerating}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
