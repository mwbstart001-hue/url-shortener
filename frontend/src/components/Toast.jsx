import React, { useState, useEffect, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const toastContextValue = {
    addToast,
    removeToast
  }

  return (
    <ToastContext.Provider value={toastContextValue}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} removeToast={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  return useContext(ToastContext)
}

const Toast = ({ toast, removeToast }) => {
  const { id, message, type, duration } = toast

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, removeToast])

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'

  return (
    <motion.div
      className={`${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 toast`}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {type === 'success' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <span>{message}</span>
    </motion.div>
  )
}