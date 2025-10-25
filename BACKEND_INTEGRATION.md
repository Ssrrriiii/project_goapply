# Backend Integration Documentation

## Overview
The frontend has been successfully integrated with the backend authentication system. The registration flow now communicates with the backend API instead of using localStorage.

## Key Changes Made

### 1. API Service Layer (`lib/api.ts`)
- Created a centralized API service for backend communication
- Handles JWT token management
- Provides proper error handling and response parsing
- Supports all authentication endpoints

### 2. Updated AuthContext (`contexts/AuthContext.tsx`)
- Replaced localStorage-based authentication with real backend API calls
- Integrated JWT token storage and management
- Added proper error handling for API responses
- Maintains session state across page refreshes

### 3. Enhanced RegisterModal (`components/auth/RegisterModal.tsx`)
- Improved error handling with specific backend error messages
- Updated password validation to match backend requirements (6 characters minimum)
- Better user feedback for registration failures

### 4. Enhanced SignInModal (`components/auth/SignInModal.tsx`)
- Added specific error handling for login failures
- Improved user feedback for authentication errors

## Backend API Endpoints Used

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/profile` - Update user profile (protected)

## Environment Configuration

The API service uses the following configuration:
- Default API URL: `http://localhost:5000/api`
- Can be overridden with `NEXT_PUBLIC_API_URL` environment variable

## Testing the Integration

### Prerequisites
1. Ensure the backend server is running on `http://localhost:5000`
2. Ensure the database is properly configured
3. Start the frontend development server

### Test Registration Flow
1. Open the application
2. Click "Sign Up" or "Register"
3. Fill in the registration form with valid data:
   - First Name: Required
   - Last Name: Required
   - Email: Valid email format
   - Password: Minimum 6 characters
   - Confirm Password: Must match password
4. Submit the form
5. Verify that:
   - User is created in the backend database
   - JWT token is stored in localStorage
   - User is redirected to the questionnaire
   - Session persists across page refreshes

### Test Login Flow
1. Use the credentials from a registered user
2. Click "Sign In"
3. Enter email and password
4. Verify that:
   - User is authenticated
   - JWT token is stored
   - User is redirected to dashboard
   - Profile data is loaded if available

### Error Handling Tests
1. Try registering with an existing email - should show "User already exists" error
2. Try logging in with invalid credentials - should show "Invalid credentials" error
3. Try registering with invalid data - should show appropriate validation errors
4. Test network connectivity issues - should show network error messages

## Security Features

- JWT tokens are stored securely in localStorage
- Tokens are automatically included in API requests
- Invalid tokens are automatically removed
- Password validation matches backend requirements
- Proper error handling prevents sensitive information leakage

## Next Steps

1. Test the complete registration flow with the backend
2. Verify profile update functionality works with the backend
3. Test session persistence across browser sessions
4. Consider adding refresh token functionality for enhanced security
5. Add loading states and better UX during API calls
