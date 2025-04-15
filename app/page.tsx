"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Home() {
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("")

  const handleGenerate = (prompt: string) => {
    setGeneratedPrompt(prompt)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-mesh">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <section className="py-12 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block mb-4 px-4 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-medium"
              >
                AI-Powered Design Assistant
              </motion.div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Transform Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
                  Creative Vision
                </span>{" "}
                Into Reality
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Moodscape helps you visualize your ideas through AI-generated mood boards, color palettes, and design
                inspiration. Simply describe your vision, and watch it come to life.
              </p>
            </motion.div>

            <Chatbot onGenerate={handleGenerate} />
          </section>

          <section className="py-16 md:py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our AI-powered platform makes it easy to bring your creative ideas to life in just a few simple steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100/50 dark:border-gray-700/50"
              >
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-white mb-2">
                  Describe Your Vision
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Tell our AI about your creative concept, including mood, colors, textures, and style preferences.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100/50 dark:border-gray-700/50"
              >
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-white mb-2">AI Generation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI analyzes your input and generates a custom color palette, font suggestions, and visual
                  elements.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100/50 dark:border-gray-700/50"
              >
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-white mb-2">
                  Explore Your Mood Board
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  View your personalized mood board with generated images, color schemes, and design elements ready to
                  inspire your project.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                  Unlock Your Creative Potential
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Whether you're a professional designer, a creative entrepreneur, or simply looking for inspiration,
                  Moodscape helps you visualize your ideas and bring them to life.
                </p>
                <ul className="space-y-4">
                  {[
                    "Generate custom color palettes tailored to your vision",
                    "Discover font combinations that perfectly match your style",
                    "Create AI-generated imagery based on your descriptions",
                    "Export your mood board for use in your projects",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      viewport={{ once: true }}
                      className="flex items-start"
                    >
                      <div className="mr-3 mt-1 w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Mood board example"
                    width={800}
                    height={600}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg -z-10" />
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-teal-100 dark:bg-teal-900/20 rounded-lg -z-10" />
              </motion.div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
