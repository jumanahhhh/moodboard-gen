"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-gray-800/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg"
            />
            <span className="text-xl font-serif font-medium text-white">Moodscape</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-200 dark:text-gray-200 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/gallery"
              className="text-gray-200 dark:text-gray-200 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors"
            >
              Gallery
            </Link>
            <Link
              href="/about"
              className="text-gray-200 dark:text-gray-200 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors"
            >
              About
            </Link>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-gray-700 dark:bg-gray-700 text-gray-200 dark:text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors shadow-md"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
          </div>

          <div className="md:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 mr-2 rounded-full bg-gray-700 dark:bg-gray-700 text-gray-200 dark:text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors shadow-md"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 dark:text-gray-200 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-gray-800 dark:bg-gray-800 shadow-lg"
        >
          <div className="container mx-auto px-6 py-4 space-y-4">
            <Link
              href="/"
              className="block text-gray-200 dark:text-gray-200 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/gallery"
              className="block text-gray-200 dark:text-gray-200 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/about"
              className="block text-gray-200 dark:text-gray-200 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
