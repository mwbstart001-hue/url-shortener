import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-white mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-8xl md:text-9xl font-bold mb-4">404</h1>
          <p className="text-2xl md:text-3xl font-semibold">短链接未找到</p>
        </motion.div>

        <motion.div
          className="card inline-block"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-700 mb-6">您所查找的短链接不存在或已被移除。</p>
          <motion.button
            className="btn-primary"
            onClick={handleGoHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            返回首页
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound