import axios, { AxiosResponse } from 'axios'
import type { APIResponse, URLResponse, StatsResponse, CreateURLRequest } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

export const shortenUrl = async (url: string): Promise<APIResponse<URLResponse>> => {
  const response: AxiosResponse<APIResponse<URLResponse>> = await apiClient.post('/shorten', {
    url
  } as CreateURLRequest)
  return response.data
}

export const getStats = async (): Promise<APIResponse<StatsResponse>> => {
  const response: AxiosResponse<APIResponse<StatsResponse>> = await apiClient.get('/stats')
  return response.data
}

export const getRecentUrls = async (): Promise<APIResponse<URLResponse[]>> => {
  const response: AxiosResponse<APIResponse<URLResponse[]>> = await apiClient.get('/urls')
  return response.data
}

export default apiClient
