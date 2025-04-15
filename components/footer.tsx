"use client"

import Link from "next/link"
import { Mail, Instagram, Twitter, Github } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="bg-gray-800/90 dark:bg-gray-800/90 border-t border-gray-700/50 dark:border-gray-700/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600"
              />
              <span className="text-xl font-serif font-medium text-white">Moodscape</span>
            </div>
            <p className="text-gray-300 dark:text-gray-300 mb-4 max-w-md">
              Moodscape helps you visualize your creative ideas through AI-powered mood boards, color palettes, and
              design inspiration.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ y: -3, color: "#10b981" }}
                href="#"
                className="text-gray-400 hover:text-emerald-400 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </motion.a>
              <motion.a
                whileHover={{ y: -3, color: "#10b981" }}
                href="#"
                className="text-gray-400 hover:text-emerald-400 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </motion.a>
              <motion.a
                whileHover={{ y: -3, color: "#10b981" }}
                href="#"
                className="text-gray-400 hover:text-emerald-400 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
              >
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </motion.a>
              <motion.a
                whileHover={{ y: -3, color: "#10b981" }}
                href="mailto:hello@moodscape.ai"
                className="text-gray-400 hover:text-emerald-400 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
              >
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <motion.div whileHover={{ x: 3 }}>
                  <Link
                    href="/docs"
                    className="text-gray-300 dark:text-gray-300 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors"
                  >
                    Documentation
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 3 }}>
                  <Link
                    href="/tutorials"
                    className="text-gray-300 dark:text-gray-300 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors"
                  >
                    Tutorials
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 3 }}>
                  <Link
                    href="/blog"
                    className="text-gray-300 dark:text-gray-300 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors"
                  >
                    Blog
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 3 }}>
                  <Link
                    href="/faq"
                    className="text-gray-300 dark:text-gray-300 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors"
                  >
                    FAQ
                  </Link>
                </motion.div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <motion.div whileHover={{ x: 3 }}>
                  <Link
                    href="/about"
                    className="text-gray-300 dark:text-gray-300 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors"
                  >
                    About Us
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 3 }}>
                  <Link
                    href="/careers"
                    className="text-gray-300 dark:text-gray-300 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors"
                  >
                    Careers
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 3 }}>
                  <Link
                    href="/privacy"
                    className="text-gray-300 dark:text-gray-300 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 3 }}>
                  <Link
                    href="/terms"
                    className="text-gray-300 dark:text-gray-300 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </motion.div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700/50 dark:border-gray-700/50 mt-12 pt-8 text-center text-sm text-gray-400 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Moodscape. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
