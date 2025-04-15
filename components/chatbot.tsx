"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { generatePalette } from "@/utils/palette-generator"
import { useRouter } from "next/navigation"
import { Send, Sparkles, Loader2, ChevronRight, MessageSquare } from "lucide-react"
import Image from "next/image"

interface Message {
  role: "user" | "assistant"
  content: string
  palette?: {
    base_color: string
    color_palette: string[]
    fonts: string[]
  }
}

interface ChatbotProps {
  onGenerate: (prompt: string) => void
}

const initialQuestions = [
  "Welcome to Moodscape! I'll help you create a beautiful mood board. What kind of mood or atmosphere are you looking to create?",
  "Are there any specific colors or color schemes you're drawn to?",
  "What kind of textures or materials inspire you?",
  "Is there a particular style or aesthetic you're interested in?",
  "Are there any specific elements or objects you'd like to include?",
]

export default function Chatbot({ onGenerate }: ChatbotProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [keywords, setKeywords] = useState<string[]>([])
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const chatControls = useAnimation()

  // Animate the chat container on mount
  useEffect(() => {
    controls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    })

    // Pulse animation for the chat container
    chatControls.start({
      boxShadow: ["0 0 0 rgba(16, 185, 129, 0)", "0 0 20px rgba(16, 185, 129, 0.3)", "0 0 0 rgba(16, 185, 129, 0)"],
      transition: { duration: 4, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY },
    })
  }, [controls, chatControls])

  useEffect(() => {
    // Add initial question with typing animation
    setIsTyping(true)
    const timer = setTimeout(() => {
      setMessages([{ role: "assistant", content: initialQuestions[0] }])
      setIsTyping(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim() || isLoading) return

    const newMessage: Message = { role: "user", content: userInput }
    setMessages((prev) => [...prev, newMessage])
    setUserInput("")
    setIsLoading(true)

    try {
      // Try with gemini-1.5-flash model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      // First, extract keywords
      const keywordPrompt = `Extract key adjectives, emotions, and descriptive words from this response: "${userInput}". Return only the keywords separated by commas.`

      const keywordResult = await model.generateContent(keywordPrompt)
      const keywordResponse = await keywordResult.response
      const extractedKeywords = keywordResponse
        .text()
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0)

      setKeywords((prev) => [...prev, ...extractedKeywords])

      if (currentQuestion < initialQuestions.length - 1) {
        // Move to next question with typing animation
        setCurrentQuestion((prev) => prev + 1)
        setIsTyping(true)

        setTimeout(() => {
          const assistantMessage: Message = {
            role: "assistant",
            content: initialQuestions[currentQuestion + 1],
          }
          setMessages((prev) => [...prev, assistantMessage])
          setIsTyping(false)
          setIsLoading(false)
        }, 1000)
      } else {
        // All questions answered, generate final prompt and palette
        const finalPrompt = `Create a detailed prompt for an image generator based on these keywords: ${keywords.join(", ")}. The prompt should be descriptive and artistic, but keep it under 2000 characters. Generate only two images.`

        const finalResult = await model.generateContent(finalPrompt)
        const finalResponse = await finalResult.response
        let generatedPrompt = finalResponse.text()

        // Ensure the prompt is not longer than 2000 characters
        if (generatedPrompt.length > 2000) {
          generatedPrompt = generatedPrompt.substring(0, 2000)
        }

        setGeneratedPrompt(generatedPrompt)

        // Generate color palette and fonts
        const palette = await generatePalette(keywords.join(" "))

        // Add typing animation for final response
        setIsTyping(true)
        setTimeout(() => {
          const assistantMessage: Message = {
            role: "assistant",
            content: `Perfect! Based on your vision, I've crafted a unique mood board concept. I've generated a color palette and font suggestions that capture the essence of your ideas.`,
            palette,
          }
          setMessages((prev) => [...prev, assistantMessage])

          // Add a button to view the moodboard
          const buttonMessage: Message = {
            role: "assistant",
            content: "View your complete mood board with colors, fonts, and generated images!",
            palette,
          }
          setMessages((prev) => [...prev, buttonMessage])

          // Store the final prompt for generation
          onGenerate(generatedPrompt)
          setIsTyping(false)
          setIsLoading(false)
        }, 1500)
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error)
      // Add more detailed error message
      setIsTyping(true)
      setTimeout(() => {
        const errorMessage: Message = {
          role: "assistant",
          content:
            "I apologize, but I encountered an error while processing your response. This might be due to the API being temporarily unavailable. Please try again in a moment.",
        }
        setMessages((prev) => [...prev, errorMessage])
        setIsTyping(false)
        setIsLoading(false)
      }, 1000)
    }
  }

  const handleQuickResponse = (response: string) => {
    setUserInput(response)
  }

  // Quick response suggestions based on current question
  const getQuickResponses = () => {
    switch (currentQuestion) {
      case 0:
        return ["Calm and serene", "Bold and energetic", "Minimalist and clean", "Warm and cozy"]
      case 1:
        return ["Earth tones", "Pastels", "Monochromatic", "Vibrant colors"]
      case 2:
        return ["Natural wood", "Soft fabrics", "Sleek metal", "Rough stone"]
      case 3:
        return ["Scandinavian", "Industrial", "Bohemian", "Modern"]
      case 4:
        return ["Plants", "Water elements", "Geometric shapes", "Vintage objects"]
      default:
        return []
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={controls}
        className="relative w-full p-6 bg-gray-800/70 dark:bg-gray-800/90 rounded-2xl overflow-hidden backdrop-blur-md border border-gray-700/50 dark:border-gray-600/50"
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 z-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
              "radial-gradient(circle at 70% 70%, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
              "radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
              "radial-gradient(circle at 70% 30%, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
              "radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
            ],
          }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 dark:bg-teal-500/10 rounded-full -ml-12 -mb-12" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg"
              >
                <MessageSquare size={20} className="text-white" />
              </motion.div>
              <h2 className="text-2xl font-serif font-medium text-white">Design Conversation</h2>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-1 px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium"
            >
              <Sparkles size={14} />
              <span>AI-Powered</span>
            </motion.div>
          </div>

          <motion.div
            animate={chatControls}
            className="h-[400px] overflow-y-auto mb-6 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-500 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent bg-gray-700/40 dark:bg-gray-700/40 backdrop-blur-sm p-4 rounded-xl shadow-inner border border-gray-600/50 dark:border-gray-600/50"
          >
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-[80%] p-4 rounded-2xl shadow-md ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white"
                        : "bg-gray-800 dark:bg-gray-700 text-gray-100 dark:text-gray-100 border border-gray-700/50 dark:border-gray-600/50"
                    } chat-bubble-glow`}
                  >
                    <div className="prose prose-sm dark:prose-invert">{message.content}</div>

                    {message.palette && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-600/30 dark:border-gray-500/30"
                      >
                        <h4 className="font-medium mb-2 text-sm">Color Palette:</h4>
                        <div className="flex gap-2 mb-4">
                          {message.palette.color_palette.map((color, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                              whileHover={{
                                scale: 1.2,
                                boxShadow: `0 0 12px ${color}`,
                              }}
                              className="w-8 h-8 rounded-full shadow-md cursor-pointer"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                        <h4 className="font-medium mb-2 text-sm">Suggested Fonts:</h4>
                        <div className="space-y-1">
                          {message.palette.fonts.map((font, i) => (
                            <motion.div key={i} className="text-sm" style={{ fontFamily: font }} whileHover={{ x: 5 }}>
                              {font}
                            </motion.div>
                          ))}
                        </div>
                        {index === messages.length - 1 && (
                          <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(16, 185, 129, 0.5)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              const queryParams = new URLSearchParams({
                                prompt: generatedPrompt,
                                palette: JSON.stringify(message.palette),
                              })
                              router.push(`/moodboard?${queryParams.toString()}`)
                            }}
                            className="mt-4 px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-lg transition-all shadow-lg flex items-center space-x-2 w-full justify-center"
                          >
                            <span>View Complete Mood Board</span>
                            <ChevronRight size={16} />
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="bg-gray-800 dark:bg-gray-700 text-gray-100 dark:text-gray-100 p-4 rounded-2xl shadow-md border border-gray-700/50 dark:border-gray-600/50">
                  <div className="flex space-x-2">
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        backgroundColor: ["rgb(75, 85, 99)", "rgb(16, 185, 129)", "rgb(75, 85, 99)"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                      className="w-2 h-2 bg-gray-500 rounded-full"
                    />
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        backgroundColor: ["rgb(75, 85, 99)", "rgb(16, 185, 129)", "rgb(75, 85, 99)"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: 0.2,
                      }}
                      className="w-2 h-2 bg-gray-500 rounded-full"
                    />
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        backgroundColor: ["rgb(75, 85, 99)", "rgb(16, 185, 129)", "rgb(75, 85, 99)"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: 0.4,
                      }}
                      className="w-2 h-2 bg-gray-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </motion.div>

          {/* Quick response suggestions */}
          {!isLoading && currentQuestion < initialQuestions.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mb-4 flex flex-wrap gap-2"
            >
              {getQuickResponses().map((response, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(16, 185, 129, 0.3)",
                    boxShadow: "0 0 8px rgba(16, 185, 129, 0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickResponse(response)}
                  className="px-3 py-1.5 bg-gray-700/70 dark:bg-gray-700/70 hover:bg-gray-600/70 dark:hover:bg-gray-600/70 rounded-full text-sm text-gray-200 dark:text-gray-200 transition-colors border border-gray-600/50 dark:border-gray-600/50 shadow-md"
                >
                  {response}
                </motion.button>
              ))}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="relative">
            <motion.input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your response..."
              disabled={isLoading || isTyping}
              whileFocus={{ boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.5)" }}
              className="w-full p-4 pr-12 rounded-xl bg-gray-700/70 dark:bg-gray-700/70 border border-gray-600/50 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 dark:focus:ring-emerald-500/70 text-gray-100 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 transition-all disabled:opacity-70 shadow-inner"
            />
            <motion.button
              type="submit"
              disabled={isLoading || isTyping || !userInput.trim()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-emerald-400 dark:text-emerald-400 hover:text-emerald-300 dark:hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} className="filter drop-shadow-md" />
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Inspiration images */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12 grid grid-cols-3 gap-4"
      >
        <motion.div
          whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="aspect-square relative rounded-lg overflow-hidden shadow-lg"
        >
          <Image
            src="/placeholder.svg?height=300&width=300"
            alt="Inspiration"
            fill
            className="object-cover transition-transform hover:scale-110 duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-3 text-white text-sm font-medium">Elegant Design</div>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          className="aspect-square relative rounded-lg overflow-hidden shadow-lg"
        >
          <Image
            src="/placeholder.svg?height=300&width=300"
            alt="Inspiration"
            fill
            className="object-cover transition-transform hover:scale-110 duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-3 text-white text-sm font-medium">Modern Aesthetic</div>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          className="aspect-square relative rounded-lg overflow-hidden shadow-lg"
        >
          <Image
            src="/placeholder.svg?height=300&width=300"
            alt="Inspiration"
            fill
            className="object-cover transition-transform hover:scale-110 duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-3 text-white text-sm font-medium">Creative Vision</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
