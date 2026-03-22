export interface URLResponse {
  short_code: string
  original_url: string
  short_url: string
  visit_count: number
  created_at: string
}

export interface StatsResponse {
  total_urls: number
  total_visits: number
  today_new_urls: number
  today_total_visits: number
}

export interface APIResponse<T> {
  code: number
  message: string
  data: T
}

export interface CreateURLRequest {
  url: string
}
