"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { Download, Share2, Heart } from "lucide-react"
import Image from "next/image"

interface Palette {
  base_color: string
  color_palette: string[]
  fonts: string[]
}

export default function MoodboardPage() {
  const searchParams = useSearchParams()
  const [prompt, setPrompt] = useState<string>("")
  const [palette, setPalette] = useState<Palette | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const promptParam = searchParams.get("prompt")
    const paletteParam = searchParams.get("palette")

    if (promptParam) {
      setPrompt(promptParam)
    }

    if (paletteParam) {
      try {
        const parsedPalette = JSON.parse(paletteParam)
        setPalette(parsedPalette)
      } catch (error) {
        console.error("Error parsing palette:", error)
      }
    }

    // Simulate loading of generated images
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-mesh">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-12 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Your Custom Mood Board
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Based on your creative vision, we've crafted this unique mood board to inspire your next project.
            </p>
          </motion.div>

          <div className="bg-gray-800/70 dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-6 md:p-10 shadow-lg border border-gray-700/50 dark:border-gray-600/50 mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-white mb-2">Design Concept</h2>
                <p className="text-gray-300 dark:text-gray-300 max-w-2xl">
                  {prompt
                    ? prompt.substring(0, 200) + (prompt.length > 200 ? "..." : "")
                    : "Your custom design concept"}
                </p>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(16, 185, 129, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 dark:bg-gray-700 rounded-lg border border-gray-600 dark:border-gray-600 text-gray-200 dark:text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors shadow-md"
                >
                  <Download size={18} />
                  <span>Export</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(16, 185, 129, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 dark:bg-gray-700 rounded-lg border border-gray-600 dark:border-gray-600 text-gray-200 dark:text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors shadow-md"
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(16, 185, 129, 0.3)" }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center w-10 h-10 bg-gray-700 dark:bg-gray-700 rounded-lg border border-gray-600 dark:border-gray-600 text-gray-200 dark:text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors shadow-md"
                >
                  <Heart size={18} />
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Color Palette */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                className="bg-gray-700/80 dark:bg-gray-700/80 rounded-lg p-6 shadow-md border border-gray-600/50 dark:border-gray-600/50"
              >
                <h3 className="text-lg font-medium text-white mb-4">Color Palette</h3>

                {palette ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-2">
                      {palette.color_palette.map((color, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          whileHover={{ scale: 1.2, boxShadow: `0 0 12px ${color}` }}
                          className="aspect-square rounded-md shadow-sm relative group cursor-pointer"
                          style={{ backgroundColor: color }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 rounded-md transition-opacity">
                            <span className="text-xs text-white font-mono bg-black/50 px-2 py-1 rounded">{color}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">Base Color</h4>
                      <div className="flex items-center space-x-2">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-8 h-8 rounded-md shadow-sm"
                          style={{ backgroundColor: palette.base_color }}
                        />
                        <span className="text-sm text-gray-300 dark:text-gray-300 font-mono">{palette.base_color}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </motion.div>

              {/* Typography */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                className="bg-gray-700/80 dark:bg-gray-700/80 rounded-lg p-6 shadow-md border border-gray-600/50 dark:border-gray-600/50"
              >
                <h3 className="text-lg font-medium text-white mb-4">Typography</h3>

                {palette ? (
                  <div className="space-y-6">
                    {palette.fonts.map((font, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300 dark:text-gray-300">
                            {index === 0 ? "Heading" : index === 1 ? "Subheading" : "Body"}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-400 font-mono">{font}</span>
                        </div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className={`${index === 0 ? "text-2xl font-bold" : index === 1 ? "text-xl font-medium" : "text-base"} text-gray-100 dark:text-gray-100`}
                          style={{ fontFamily: font }}
                        >
                          {index === 0
                            ? "Beautiful Typography"
                            : index === 1
                              ? "Elegant font pairing"
                              : "Clean and readable body text for your design projects."}
                        </motion.div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </motion.div>

              {/* Design Elements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                className="bg-gray-700/80 dark:bg-gray-700/80 rounded-lg p-6 shadow-md border border-gray-600/50 dark:border-gray-600/50"
              >
                <h3 className="text-lg font-medium text-white mb-4">Design Elements</h3>

                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="aspect-square bg-gray-600 dark:bg-gray-600 rounded-md overflow-hidden"
                  >
                    <motion.div
                      animate={{
                        background: [
                          "linear-gradient(to bottom right, #1e40af, #3b82f6)",
                          "linear-gradient(to bottom right, #0f766e, #14b8a6)",
                          "linear-gradient(to bottom right, #1e40af, #3b82f6)",
                        ],
                      }}
                      transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-full h-full"
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="aspect-square bg-gray-600 dark:bg-gray-600 rounded-md overflow-hidden"
                  >
                    <motion.div
                      animate={{
                        background: [
                          "linear-gradient(to bottom right, #0f766e, #14b8a6)",
                          "linear-gradient(to bottom right, #7e22ce, #a855f7)",
                          "linear-gradient(to bottom right, #0f766e, #14b8a6)",
                        ],
                      }}
                      transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-full h-full"
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="aspect-square bg-gray-600 dark:bg-gray-600 rounded-md overflow-hidden"
                  >
                    <motion.div
                      animate={{
                        background: [
                          "linear-gradient(to bottom right, #7e22ce, #a855f7)",
                          "linear-gradient(to bottom right, #be123c, #f43f5e)",
                          "linear-gradient(to bottom right, #7e22ce, #a855f7)",
                        ],
                      }}
                      transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-full h-full"
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="aspect-square bg-gray-600 dark:bg-gray-600 rounded-md overflow-hidden"
                  >
                    <motion.div
                      animate={{
                        background: [
                          "linear-gradient(to bottom right, #be123c, #f43f5e)",
                          "linear-gradient(to bottom right, #1e40af, #3b82f6)",
                          "linear-gradient(to bottom right, #be123c, #f43f5e)",
                        ],
                      }}
                      transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-full h-full"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Generated Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-10"
            >
              <h3 className="text-xl font-serif font-semibold text-white mb-6">Generated Imagery</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  <>
                    <div className="aspect-[4/3] bg-gray-700 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-600/50 dark:border-gray-600/50">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    </div>
                    <div className="aspect-[4/3] bg-gray-700 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-600/50 dark:border-gray-600/50">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}
                      className="aspect-[4/3] bg-gray-700 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md group relative border border-gray-600/50 dark:border-gray-600/50"
                    >
                      <Image
                        src="/placeholder.svg?height=600&width=800"
                        alt="Generated image 1"
                        width={800}
                        height={600}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                        <div className="p-4 w-full">
                          <div className="flex justify-between items-center">
                            <span className="text-white text-sm">Image 1</span>
                            <motion.button
                              whileHover={{ scale: 1.2, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-white/20 rounded-full backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                            >
                              <Download size={16} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}
                      className="aspect-[4/3] bg-gray-700 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md group relative border border-gray-600/50 dark:border-gray-600/50"
                    >
                      <Image
                        src="/placeholder.svg?height=600&width=800"
                        alt="Generated image 2"
                        width={800}
                        height={600}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                        <div className="p-4 w-full">
                          <div className="flex justify-between items-center">
                            <span className="text-white text-sm">Image 2</span>
                            <motion.button
                              whileHover={{ scale: 1.2, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-white/20 rounded-full backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                            >
                              <Download size={16} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-4">
              Ready to create another mood board?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Start a new conversation with our AI assistant to generate a fresh mood board based on your creative
              vision.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-lg transition-all shadow-lg"
              onClick={() => (window.location.href = "/")}
            >
              Create New Mood Board
            </motion.button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
