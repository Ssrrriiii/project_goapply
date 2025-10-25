"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserProfile } from '@/models/user'
import apiService from '@/lib/api'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>
  signOut: () => void
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>
  resumeRegistration: () => number // Returns step to resume from
  // Questionnaire methods
  getQuestionnaireProgress: () => Promise<{ currentStep: number; completedSteps: number[]; profile: any }>
  saveQuestionnaireStep: (step: number, data: any) => Promise<void>
  completeQuestionnaire: (profileData: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const token = apiService.getToken()
        if (token) {
          // Verify token and get user profile
          const response = await apiService.getProfile()
          if (response.success && response.user) {
            setUser(response.user)
            if (response.data?.profile) {
              setProfile(response.data.profile)
            }
          } else {
            // Token is invalid, remove it
            apiService.removeToken()
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
        apiService.removeToken()
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await apiService.login({ email, password })
      
      if (response.success && response.token && response.user) {
        // Store token and user data
        apiService.setToken(response.token)
        setUser(response.user)
        
        // Get user profile if available
        if (response.data?.profile) {
          setProfile(response.data.profile)
        }
      } else {
        throw new Error(response.error || 'Login failed')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
    setIsLoading(true)
    try {
      const response = await apiService.register(userData)
      
      if (response.success && response.token && response.user) {
        // Store token and user data
        apiService.setToken(response.token)
        setUser(response.user)
        
        // Create a basic profile structure for the new user
        const newProfile: UserProfile = {
          userId: response.user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setProfile(newProfile)
      } else {
        throw new Error(response.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    setProfile(null)
    apiService.removeToken()
  }

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return

    try {
      const response = await apiService.updateProfile(profileData)
      
      if (response.success) {
        const updatedProfile: UserProfile = {
          userId: user.id,
          ...profile,
          ...profileData,
          updatedAt: new Date(),
          createdAt: profile?.createdAt || new Date()
        }
        
        setProfile(updatedProfile)
      } else {
        throw new Error(response.error || 'Profile update failed')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  const resumeRegistration = (): number => {
    return user?.registrationStep || 1
  }

  // Questionnaire methods
  const getQuestionnaireProgress = async () => {
    try {
      const response = await apiService.getQuestionnaireProgress()
      if (response.success) {
        return {
          currentStep: response.data?.currentStep || 1,
          completedSteps: response.data?.completedSteps || [],
          profile: response.data?.profile
        }
      }
      throw new Error(response.error || 'Failed to get questionnaire progress')
    } catch (error) {
      console.error('Get questionnaire progress error:', error)
      throw error
    }
  }

  const saveQuestionnaireStep = async (step: number, data: any) => {
    try {
      const response = await apiService.saveQuestionnaireStep(step, data)
      if (response.success) {
        // Update local profile state
        if (response.data?.profile) {
          setProfile(response.data.profile)
        }
      } else {
        throw new Error(response.error || 'Failed to save questionnaire step')
      }
    } catch (error) {
      console.error('Save questionnaire step error:', error)
      throw error
    }
  }

  const completeQuestionnaire = async (profileData: any) => {
    try {
      const response = await apiService.completeQuestionnaire(profileData)
      if (response.success) {
        // Update local profile state
        if (response.data?.profile) {
          setProfile(response.data.profile)
        }
      } else {
        throw new Error(response.error || 'Failed to complete questionnaire')
      }
    } catch (error) {
      console.error('Complete questionnaire error:', error)
      throw error
    }
  }

  const value = {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resumeRegistration,
    getQuestionnaireProgress,
    saveQuestionnaireStep,
    completeQuestionnaire
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}