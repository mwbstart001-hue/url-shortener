import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'

const Result = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [copied, setCopied] = useState(false)

  const { shortUrl, longUrl, shortCode } = location.state || {}

  // If no state is passed, redirect to home
  if (!shortUrl) {
    navigate('/')
    return null
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      addToast('Short URL copied to clipboard!', 'success')
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
      addToast('Failed to copy URL. Please try again.', 'error')
    }
  }

  const handleRedirect = () => {
    window.open(longUrl, '_blank', 'noopener,noreferrer')
  }

  const handleNewUrl = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-3xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            短链接已生成
          </motion.h1>
          <motion.p 
            className="text-white/80 text-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            这是您的短链接
          </motion.p>
        </div>

        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2 text-sm">短链接</label>
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                value={shortUrl} 
                readOnly 
                className="input-field bg-gray-50 cursor-not-allowed flex-grow"
              />
              <motion.button
                className={`btn-primary ${copied ? 'bg-green-500 hover:bg-green-600' : ''}`}
                onClick={handleCopy}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    已复制！
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    复制
                  </>
                )}
              </motion.button>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-600 font-medium mb-2 text-sm">原始链接</label>
            <input 
              type="text" 
              value={longUrl} 
              readOnly 
              className="input-field bg-gray-50 cursor-not-allowed"
            />
            <motion.button
              className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              onClick={handleRedirect}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              访问原始链接
            </motion.button>
          </div>

          <div className="flex space-x-4">
            <motion.button
              className="btn-primary flex-1"
              onClick={handleNewUrl}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              生成另一个链接
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Result