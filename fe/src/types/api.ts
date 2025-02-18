// Chứa các kiểu dữ liệu chung cho API (request/response).
// src/types/api.ts
export interface ErrorResponse {
  message: string
  statusCode: number
}

export interface Pagination {
  page: number
  limit: number
  total: number
}
