const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  token?: string
  user?: any
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

interface LoginData {
  email: string
  password: string
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

class ApiService {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = this.getToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      
      // Handle non-JSON responses
      let data
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = { error: await response.text() || `HTTP error! status: ${response.status}` }
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || `HTTP error! status: ${response.status}`,
        }
      }

      return {
        success: true,
        ...data,
      }
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error - please check your connection',
      }
    }
  }

  // Auth methods
  async register(data: RegisterData): Promise<ApiResponse<{ user: User; token: string; profile?: any }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async login(data: LoginData): Promise<ApiResponse<{ user: User; token: string; profile?: any }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getProfile(): Promise<ApiResponse<{ user: User; profile: any }>> {
    return this.request('/auth/profile', {
      method: 'GET',
    })
  }

  async updateProfile(profileData: any): Promise<ApiResponse<any>> {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  // Questionnaire methods
  async getQuestionnaireProgress(): Promise<ApiResponse<{ currentStep: number; completedSteps: number[]; profile: any }>> {
    return this.request('/profile/questionnaire/progress', {
      method: 'GET',
    })
  }

  async saveQuestionnaireStep(step: number, data: any): Promise<ApiResponse<{ profile: any; currentStep: number }>> {
    return this.request('/profile/questionnaire/step', {
      method: 'POST',
      body: JSON.stringify({ step, data }),
    })
  }

  async completeQuestionnaire(profileData: any): Promise<ApiResponse<{ profile: any; message: string }>> {
    return this.request('/profile/questionnaire/complete', {
      method: 'POST',
      body: JSON.stringify(profileData),
    })
  }

  // Token management
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

// Create and export a singleton instance
export const apiService = new ApiService()
export default apiService
