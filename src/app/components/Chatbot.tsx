'use client';

import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotProps {
  onGenerate: (prompt: string) => void;
}

const initialQuestions = [
  "What kind of mood or atmosphere are you looking to create?",
  "Are there any specific colors or color schemes you're drawn to?",
  "What kind of textures or materials inspire you?",
  "Is there a particular style or aesthetic you're interested in?",
  "Are there any specific elements or objects you'd like to include?"
];

export default function Chatbot({ onGenerate }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    // Add initial question
    setMessages([{ role: 'assistant', content: initialQuestions[0] }]);
  }, []);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessage: Message = { role: 'user', content: userInput };
    setMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Try with gemini-1.0-pro model first
      let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // First, extract keywords
      const keywordPrompt = `Extract key adjectives, emotions, and descriptive words from this response: "${userInput}". Return only the keywords separated by commas.`;
      console.log('Sending keyword extraction prompt:', keywordPrompt);
      
      try {
        const keywordResult = await model.generateContent(keywordPrompt);
        const keywordResponse = await keywordResult.response;
        const extractedKeywords = keywordResponse.text()
          .split(',')
          .map(k => k.trim())
          .filter(k => k.length > 0);
        
        console.log('Extracted keywords:', extractedKeywords);
        setKeywords(prev => [...prev, ...extractedKeywords]);
        
        if (currentQuestion < initialQuestions.length - 1) {
          // Move to next question
          setCurrentQuestion(prev => prev + 1);
          const assistantMessage: Message = {
            role: 'assistant',
            content: initialQuestions[currentQuestion + 1]
          };
          setMessages(prev => [...prev, assistantMessage]);
        } else {
          // All questions answered, generate final prompt
          const finalPrompt = `Create a detailed prompt for an image generator based on these keywords: ${keywords.join(', ')}. The prompt should be descriptive and artistic, but keep it under 2000 characters.`;
          console.log('Sending final prompt generation:', finalPrompt);
          
          const finalResult = await model.generateContent(finalPrompt);
          const finalResponse = await finalResult.response;
          let generatedPrompt = finalResponse.text();
          
          // Ensure the prompt is not longer than 2000 characters
          if (generatedPrompt.length > 2000) {
            generatedPrompt = generatedPrompt.substring(0, 2000);
          }
          
          console.log('Generated final prompt:', generatedPrompt);
          
          const assistantMessage: Message = {
            role: 'assistant',
            content: `Great! Based on your responses, I've created this prompt: "${generatedPrompt}". Would you like to generate the moodboard now?`
          };
          setMessages(prev => [...prev, assistantMessage]);
          
          // Add a system message for the generate button
          const systemMessage: Message = {
            role: 'assistant',
            content: 'Click the button below to generate your moodboard!'
          };
          setMessages(prev => [...prev, systemMessage]);
          
          // Store the final prompt for generation
          onGenerate(generatedPrompt);
        }
      } catch (modelError) {
        console.error('Error with gemini-1.0-pro model:', modelError);
        // Try with gemini-pro model as fallback
        model = genAI.getGenerativeModel({ model: "gemini-pro" });
        throw modelError; // Re-throw to be caught by outer catch block
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      // Add more detailed error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your response. This might be due to the API being temporarily unavailable or the model not being accessible. Please try again in a moment or check your API key configuration.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl"
    >
      <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your response..."
          className="flex-1 p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </motion.div>
  );
} 