import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// API endpoints
export const createShortLink = async (longUrl) => {
  return api.post('/shorten', { longUrl })
}

export const getShortLinkInfo = async (shortCode) => {
  return api.get(`/info/${shortCode}`)
}

// Export api instance for custom requests
export default api