"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserProfile } from '@/models/user'

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
        // This would typically check localStorage/sessionStorage or make an API call
        const savedUser = localStorage.getItem('user')
        const savedProfile = localStorage.getItem('profile')
        
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile))
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Check if user exists in localStorage from previous registration
      const existingUsers = localStorage.getItem('registeredUsers')
      let userData: User | null = null
      
      if (existingUsers) {
        const users = JSON.parse(existingUsers)
        userData = users.find((u: User) => u.email === email)
      }
      
      // If no user found, create a demo user with the email
      if (!userData) {
        userData = {
          id: '1',
          email,
          firstName: 'John',
          lastName: 'Doe',
          profileCompleted: true,
          registrationStep: 8,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
      
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Also load their profile if it exists
      const savedProfile = localStorage.getItem(`profile_${userData.id}`)
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile))
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
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileCompleted: false,
        registrationStep: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // Store user in both current session and registered users list
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      // Keep track of all registered users
      const existingUsers = localStorage.getItem('registeredUsers')
      const users = existingUsers ? JSON.parse(existingUsers) : []
      users.push(newUser)
      localStorage.setItem('registeredUsers', JSON.stringify(users))
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
    localStorage.removeItem('user')
    localStorage.removeItem('profile')
  }

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return

    try {
      const updatedProfile: UserProfile = {
        userId: user.id,
        ...profile,
        ...profileData,
        updatedAt: new Date(),
        createdAt: profile?.createdAt || new Date()
      }
      
      // Update user data if firstName or lastName are provided
      const updatedUser: User = {
        ...user,
        firstName: (profileData as any).firstName || user.firstName,
        lastName: (profileData as any).lastName || user.lastName,
        profileCompleted: true,
        registrationStep: 8,
        updatedAt: new Date()
      }

      setProfile(updatedProfile)
      setUser(updatedUser)
      
      // Store profile with user-specific key
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile))
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      // Update in registered users list
      const existingUsers = localStorage.getItem('registeredUsers')
      if (existingUsers) {
        const users = JSON.parse(existingUsers)
        const userIndex = users.findIndex((u: User) => u.id === user.id)
        if (userIndex !== -1) {
          users[userIndex] = updatedUser
          localStorage.setItem('registeredUsers', JSON.stringify(users))
        }
      }
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  const resumeRegistration = (): number => {
    return user?.registrationStep || 1
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
    resumeRegistration
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