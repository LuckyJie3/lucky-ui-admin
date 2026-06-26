/* =============================================
   Axios 请求封装
   ============================================= */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from 'axios'
import { getStorage } from '@/utils/storage'
import { ElMessage } from 'element-plus'

// 响应数据结构
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// 创建 Axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string | undefined,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStorage<string>('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data

    // 根据约定 code === 0 表示成功
    if (res.code !== 0 && res.code !== undefined) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return response
  },
  (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status

    switch (status) {
      case 401:
        // Token 过期，清除登录态
        ElMessage.error('登录已过期，请重新登录')
        // 可在此触发登出逻辑
        break
      case 403:
        ElMessage.error('没有权限访问该资源')
        break
      case 404:
        ElMessage.error('请求的资源不存在')
        break
      case 500:
        ElMessage.error('服务器内部错误')
        break
      default:
        if (error.message?.includes('timeout')) {
          ElMessage.error('请求超时，请稍后重试')
        } else if (error.message?.includes('Network Error')) {
          ElMessage.error('网络错误，请检查网络连接')
        } else {
          ElMessage.error(error.message || '请求失败')
        }
    }
    return Promise.reject(error)
  }
)

/**
 * 通用请求方法（类型安全）
 */
export async function request<T = unknown>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const response = await instance.request<ApiResponse<T>>(config)
  return response.data
}

export async function get<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return request<T>({ ...config, method: 'GET', url, params })
}

export async function post<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return request<T>({ ...config, method: 'POST', url, data })
}

export async function put<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return request<T>({ ...config, method: 'PUT', url, data })
}

export async function del<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  return request<T>({ ...config, method: 'DELETE', url })
}

export default instance
