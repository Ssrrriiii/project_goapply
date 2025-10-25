# Questionnaire and Profile Integration Documentation

## Overview
The questionnaire and profile functionality has been successfully integrated with the backend. The system now supports step-by-step progress saving, real-time data persistence, and seamless user experience across sessions.

## Key Changes Made

### 1. Backend Model Updates (`backend/src/models/UserProfile.ts`)

**Updated UserProfile Interface:**
- Aligned with frontend UserProfile structure
- Added comprehensive questionnaire fields:
  - `fieldOfStudy`: User's academic field
  - `studyLevel`: Academic level (masters, bachelors, diploma)
  - `nationality`: User's nationality
  - `englishProficiency`: Detailed English test information
  - `availableFunds`: Financial capacity in USD
  - `visaRefusalHistory`: Visa refusal details
  - `intendedStartDate`: Planned study start date
  - `education`: Educational background details
  - `standardizedTests`: Test scores (GMAT, GRE, None)

**Progress Tracking:**
- `currentStep`: Current questionnaire step (1-8)
- `completedSteps`: Array of completed steps

### 2. Backend API Endpoints (`backend/src/controllers/profileController.ts`)

**New Endpoints:**
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/profile/questionnaire/progress` - Get questionnaire progress
- `POST /api/profile/questionnaire/step` - Save questionnaire step
- `POST /api/profile/questionnaire/complete` - Complete questionnaire

**Features:**
- Step-by-step progress saving
- Automatic progress tracking
- Data validation and error handling
- Upsert functionality for new users

### 3. Frontend API Service (`lib/api.ts`)

**New Methods:**
- `getQuestionnaireProgress()` - Fetch current progress
- `saveQuestionnaireStep(step, data)` - Save step data
- `completeQuestionnaire(profileData)` - Complete questionnaire

**Features:**
- Proper error handling
- TypeScript type safety
- Automatic token management

### 4. AuthContext Updates (`contexts/AuthContext.tsx`)

**New Methods:**
- `getQuestionnaireProgress()` - Get progress from backend
- `saveQuestionnaireStep(step, data)` - Save step to backend
- `completeQuestionnaire(profileData)` - Complete questionnaire

**Features:**
- Real-time state synchronization
- Error handling and user feedback
- Automatic profile updates

### 5. RegistrationQuestionnaire Component (`components/auth/RegistrationQuestionnaire.tsx`)

**Enhanced Features:**
- Backend integration for progress saving
- Real-time step persistence
- Error handling and user feedback
- Loading states during API calls
- Fallback to localStorage if backend unavailable

## Database Structure

### MongoDB Collection: `userprofiles`

**Document Structure:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to User
  // Basic profile info
  phone: String,
  dateOfBirth: String,
  address: String,
  bio: String,
  
  // Academic info
  fieldOfStudy: String,
  studyLevel: String, // 'masters' | 'bachelors' | 'diploma'
  nationality: String,
  englishProficiency: {
    hasTestResults: Boolean,
    examType: String, // 'IELTS' | 'TOEFL' | 'PTE' | 'Duolingo' | 'Other'
    examScore: String,
    proficiencyLevel: String // 'Beginner' | 'Intermediate' | 'Advanced' | 'Native'
  },
  availableFunds: Number, // in USD
  visaRefusalHistory: {
    hasBeenRefused: Boolean,
    details: String
  },
  intendedStartDate: Date,
  education: {
    highestLevel: String, // 'graduated' | 'studying'
    country: String,
    level: String, // 'primary' | 'secondary' | 'undergraduate' | 'postgraduate'
    grade: String,
    details: String
  },
  standardizedTests: [String], // ['GMAT', 'GRE', 'None']
  
  // Progress tracking
  currentStep: Number, // 1-8
  completedSteps: [Number],
  
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints Reference

### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Questionnaire Management
- `GET /api/profile/questionnaire/progress` - Get questionnaire progress
- `POST /api/profile/questionnaire/step` - Save questionnaire step
- `POST /api/profile/questionnaire/complete` - Complete questionnaire

### Request/Response Examples

**Save Questionnaire Step:**
```javascript
POST /api/profile/questionnaire/step
{
  "step": 3,
  "data": {
    "fieldOfStudy": "Computer Science",
    "studyLevel": "masters"
  }
}

Response:
{
  "success": true,
  "profile": { /* updated profile */ },
  "currentStep": 3
}
```

**Get Progress:**
```javascript
GET /api/profile/questionnaire/progress

Response:
{
  "success": true,
  "currentStep": 3,
  "completedSteps": [1, 2, 3],
  "profile": { /* full profile data */ }
}
```

## User Experience Flow

1. **Registration**: User creates account → Basic profile created
2. **Questionnaire Start**: User begins questionnaire → Progress tracked
3. **Step-by-Step**: Each step saves automatically → Real-time persistence
4. **Progress Resume**: User can resume from last completed step
5. **Completion**: Final step completes questionnaire → Profile finalized

## Error Handling

**Frontend Error Handling:**
- Network errors with user-friendly messages
- Validation errors from backend
- Fallback to localStorage if backend unavailable
- Loading states during API calls

**Backend Error Handling:**
- Input validation
- Database error handling
- Proper HTTP status codes
- Detailed error messages

## Security Features

- JWT token authentication for all endpoints
- User-specific data isolation
- Input validation and sanitization
- Secure data transmission

## Testing the Integration

### Prerequisites
1. Backend server running on `http://localhost:5000`
2. MongoDB database configured
3. Frontend development server running

### Test Scenarios

1. **Complete Questionnaire Flow:**
   - Register new user
   - Start questionnaire
   - Complete all 8 steps
   - Verify data saved in database

2. **Progress Persistence:**
   - Start questionnaire
   - Complete first 3 steps
   - Close browser/reload page
   - Resume from step 4

3. **Error Handling:**
   - Test with backend offline
   - Verify localStorage fallback
   - Test invalid data submission

4. **Data Validation:**
   - Submit invalid field values
   - Verify backend validation
   - Check error messages

## Migration Notes

**Existing Data:**
- Existing UserProfile documents will work with new schema
- New fields are optional and will be populated as users complete questionnaire
- No data migration required

**Backward Compatibility:**
- Old API endpoints deprecated but still functional
- New endpoints provide enhanced functionality
- Gradual migration recommended

## Performance Considerations

- Step-by-step saving reduces data loss
- Efficient MongoDB queries with proper indexing
- Minimal data transfer with incremental updates
- Caching strategy for frequently accessed data

## Future Enhancements

1. **Real-time Collaboration**: Multiple users editing same profile
2. **Version History**: Track profile changes over time
3. **Analytics**: Questionnaire completion analytics
4. **Export Functionality**: Export profile data
5. **Bulk Operations**: Admin tools for profile management

## Troubleshooting

**Common Issues:**
1. **Progress not saving**: Check JWT token validity
2. **Data not loading**: Verify backend connectivity
3. **Validation errors**: Check field types and required fields
4. **Performance issues**: Monitor database queries and indexes

**Debug Tools:**
- Browser developer tools for API calls
- MongoDB Compass for data inspection
- Backend logs for error tracking
- Network tab for request/response analysis
