"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { Download, Share2, Heart, Loader2 } from "lucide-react"
import Image from "next/image"

interface Palette {
  base_color: string
  color_palette: string[]
  fonts: string[]
}

async function generateImages(prompt: string) {
  try {
    // First, join the queue
    const session_hash = Math.random().toString(36).substring(7)
    const queueResponse = await fetch(`https://37b2e326a265ff3621.gradio.live/gradio_api/queue/join?`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fn_index: 0,
        session_hash: session_hash,
        data: [prompt]
      }),
    })

    if (!queueResponse.ok) {
      throw new Error(`Queue join error! status: ${queueResponse.status}`)
    }

    const queueData = await queueResponse.json()
    console.log("Queue Response:", queueData)

    // Then get the result using EventSource for SSE
    return new Promise<{ images: string[], palette: Palette }>((resolve, reject) => {
      const eventSource = new EventSource(`https://37b2e326a265ff3621.gradio.live/gradio_api/queue/data?session_hash=${session_hash}`)
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log("SSE Data:", data)
          
          if (data.msg === "process_completed") {
            eventSource.close()
            if (data.output && data.output.data) {
              // Extract images (first 4 items)
              const imageUrls = data.output.data
                .slice(0, 4)
                .map((item: any) => item.url)
                .filter(Boolean)

              // Extract color palette (items 4-7)
              const colorPalettes = data.output.data.slice(4, 8)
              const colors = colorPalettes[0] // Use the first color palette
                .split('\n')
                .map((line: string) => {
                  const match = line.match(/#[0-9a-fA-F]{6}/)
                  return match ? match[0] : null
                })
                .filter(Boolean)

              // Extract fonts (item 8)
              const fontsHtml = data.output.data[8]
              const fontMatches = fontsHtml.match(/font-family:'([^']+)'/g)
              const fonts = fontMatches 
                ? fontMatches.map((match: string) => match.replace(/font-family:'([^']+)'/, '$1'))
                : []

              const palette: Palette = {
                base_color: colors[0] || '#000000',
                color_palette: colors,
                fonts: fonts
              }

              console.log("Extracted data:", { imageUrls, palette })
              resolve({ images: imageUrls, palette })
            } else {
              resolve({ images: [], palette: { base_color: '#000000', color_palette: [], fonts: [] } })
            }
          }
        } catch (error) {
          console.error("Error parsing SSE data:", error)
          eventSource.close()
          resolve({ images: [], palette: { base_color: '#000000', color_palette: [], fonts: [] } })
        }
      }

      eventSource.onerror = (error) => {
        console.error("SSE Error:", error)
        eventSource.close()
        resolve({ images: [], palette: { base_color: '#000000', color_palette: [], fonts: [] } })
      }
    })
  } catch (error) {
    console.error("Error generating images:", error)
    return { images: [], palette: { base_color: '#000000', color_palette: [], fonts: [] } }
  }
}

export default function MoodboardPage() {
  const searchParams = useSearchParams()
  const [prompt, setPrompt] = useState<string>("")
  const [palette, setPalette] = useState<Palette | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const promptParam = urlParams.get("prompt")
    const paletteParam = urlParams.get("palette")

    if (promptParam) {
      setPrompt(promptParam)
    }

    if (paletteParam) {
      try {
        setPalette(JSON.parse(paletteParam))
      } catch (e) {
        console.error("Error parsing palette:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (prompt) {
      const generateAndSetImages = async () => {
        try {
          setIsLoading(true)
          setError(null)
          const { images, palette: newPalette } = await generateImages(prompt)
          console.log("Generated data:", { images, newPalette })
          if (images.length > 0) {
            setGeneratedImages(images)
            setPalette(newPalette)
          } else {
            setError("No images were generated. Please try again.")
          }
        } catch (err) {
          console.error("Error in image generation:", err)
          setError("Failed to generate images. Please try again later.")
        } finally {
          setIsLoading(false)
        }
      }

      generateAndSetImages()
    }
  }, [prompt])

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

              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-64"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                  <p className="mt-4 text-gray-400">Generating your mood board...</p>
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8"
                >
                  <p className="text-red-400">{error}</p>
                </motion.div>
              ) : generatedImages.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {generatedImages.map((imageUrl, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group"
                    >
                      <img
                        src={imageUrl}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(imageUrl, "_blank")}
                        className="absolute bottom-4 right-4 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Download size={20} />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-400"
                >
                  <p>No images generated yet. Please try again.</p>
                </motion.div>
              )}
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
