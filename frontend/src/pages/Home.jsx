import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import { createShortLink } from '../services/api'

const Home = () => {
  const [longUrl, setLongUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { addToast } = useToast()

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate URL
    if (!longUrl.trim()) {
      setError('Please enter a URL')
      return
    }

    if (!validateUrl(longUrl)) {
      setError('Please enter a valid URL (including http:// or https://)')
      return
    }

    setIsLoading(true)

    try {
      const response = await createShortLink(longUrl)
      if (response.data.success) {
        navigate('/result', { state: { shortUrl: response.data.shortUrl, longUrl, shortCode: response.data.shortCode } })
        addToast('Short link generated successfully!', 'success')
      } else {
        setError(response.data.message || 'Failed to generate short link')
      }
    } catch (err) {
      console.error('Error generating short link:', err)
      setError('Failed to generate short link. Please try again later.')
      addToast('Failed to generate short link. Please try again later.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-4xl" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">URL 缩短工具</h1>
          <p className="text-white/80 text-lg">几秒钟内创建简短易记的链接</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="longUrl" className="block text-gray-700 font-medium mb-2">长链接</label>
              <motion.input
                id="longUrl"
                type="text"
                placeholder="输入您的长链接（包括 http:// 或 https://）"
                className={`input-field ${error ? 'border-red-500 animate-shake' : ''}`}
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                whileFocus={{ scale: 1.01 }}
                onFocus={() => setError('')}
              />
              {error && (
                <motion.p 
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
              whileHover={isLoading ? { scale: 1 } : { scale: 1.02 }}
              whileTap={isLoading ? { scale: 1 } : { scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <span>生成中...</span>
                  <motion.div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  />
                </div>
              ) : (
                '缩短链接'
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Home