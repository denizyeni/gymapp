Gym Tracker Application

A Progressive Web App (PWA) for tracking gym attendance with shared calendar features, photo proof verification, and social engagement capabilities.

## Overview

This application helps fitness enthusiasts track their workout consistency through a visual calendar interface, enabling users to maintain accountability through daily check-ins, photo proof of attendance, and social features including likes and comments.

## Features

### Authentication
- Secure Firebase Authentication
- Email and password login
- Persistent session management
- User authorization controls

### Calendar & Streak Tracking
- Interactive monthly calendar view
- Visual distinction between logged and missed days
- Real-time streak calculation
- Dual-user streak display on login page
- Calendar navigation (previous/next month)
- Today indicator

### Check-In System
- Daily gym check-ins with photo proof
- Image upload with caption support
- Photo viewer with full-screen display
- Date-specific check-in validation

### Social Features
- Like system for check-in photos
- Commenting on workout photos
- Real-time comment updates via Firestore listeners
- Profile photo customization

### User Management
- Custom display name configuration
- Profile picture upload and management
- Password change functionality
- Secure logout

### Partner Viewing
- View partner's calendar
- Toggle between personal and partner calendars
- See partner's check-ins and streaks

### Progressive Web App Features
- Installable on iOS and Android devices
- Standalone app mode
- Optimized for mobile viewing
- Install banner with instructions for iOS users
- Custom app icons and splash screens
- Offline-ready architecture

## Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Firebase Suite
  - Authentication
  - Firestore (NoSQL database)
  - Storage (image hosting)
- **Styling**: Custom CSS with CSS variables for theming
- **Font**: Manrope (Google Fonts)
- **Icons**: Native emoji support

## Project Structure

```
gymapp/
├── index.html              # Login page with streak display
├── dashboard.html          # Main app dashboard
├── firebase-config.js      # Firebase initialization and exports
└── README.md              # This file
```

## Key Components

### index.html
- User authentication interface
- Real-time streak display for both users
- Error handling and validation
- iOS PWA install prompt
- Responsive login form

### dashboard.html
- Monthly calendar grid display
- Check-in button with photo upload
- Photo viewer modal with social features
- Profile management interface
- Partner calendar view toggle
- Month navigation controls
- Comments and likes system

### firebase-config.js
- Firebase SDK initialization
- Centralized Firebase service exports
- Configuration for Auth, Firestore, and Storage

## Data Structure

### Firestore Collections

#### `check-ins`
```javascript
{
  userId: string,
  date: string (YYYY-MM-DD),
  photoURL: string,
  caption: string,
  timestamp: timestamp,
  likes: array<string>,
  likeCount: number
}
```

#### `comments`
```javascript
{
  checkInId: string,
  userId: string,
  userName: string,
  userAvatar: string,
  text: string,
  timestamp: timestamp
}
```

#### `users`
```javascript
{
  name: string,
  avatar: string,
  lastModified: timestamp
}
```

#### `gym-config/names`
```javascript
{
  user1: string,
  user2: string
}
```

## Streak Calculation

The streak system calculates consecutive days of gym attendance:
- Counts backwards from today or yesterday
- Resets if more than one day is missed
- Updates in real-time on login page
- Visual indicators (flame icon animation for active streaks)
- "Cold" state for zero streaks

## Problems Encountered & Solutions

### 1. **Firebase Module Import Issues**
- **Problem**: Initial confusion between CDN vs npm Firebase imports in vanilla JS
- **Solution**: Used Firebase modular SDK v9+ with CDN imports from `gstatic.com`

### 2. **Image Upload Performance**
- **Problem**: Large images caused slow uploads and storage bloat
- **Solution**: Could benefit from client-side image compression before upload (noted for future improvement)

### 3. **Date Timezone Inconsistencies**
- **Problem**: Check-ins recorded with incorrect dates due to timezone handling
- **Solution**: Implemented consistent date formatting using local timezone with `YYYY-MM-DD` format

### 4. **Real-time Updates**
- **Problem**: Comments and likes not updating without page refresh
- **Solution**: Implemented Firestore `onSnapshot` listeners for real-time synchronization

### 5. **Modal State Management**
- **Problem**: Multiple modals could overlap or get stuck in open state
- **Solution**: Implemented backdrop click handlers and consistent show/hide logic

### 6. **PWA Installation UX**
- **Problem**: Users didn't know how to install the app on iOS (no native prompt)
- **Solution**: Created custom install banner with step-by-step instructions for iOS users

### 7. **Authentication Redirect Loops**
- **Problem**: Users getting redirected back to login after successful authentication
- **Solution**: Implemented proper `onAuthStateChanged` listener with email-to-userId mapping

### 8. **Calendar Day Rendering**
- **Problem**: Days from adjacent months appearing with incorrect styling
- **Solution**: Added `.other-month` class with reduced opacity and disabled interactions

### 9. **Mobile Touch Responsiveness**
- **Problem**: Small touch targets and poor mobile layout
- **Solution**: Increased button sizes, added proper viewport meta tags, and implemented responsive grid

### 10. **Photo Preview Before Upload**
- **Problem**: Users couldn't see selected photo before submitting
- **Solution**: Implemented FileReader API for instant client-side image preview

### 11. **Streak Calculation Edge Cases**
- **Problem**: Streak continued even after missing days
- **Solution**: Rewrote algorithm to check consecutive days backwards from today/yesterday only

### 12. **Password Change Security**
- **Problem**: Password changes without re-authentication could be exploited
- **Solution**: Requires current password verification before allowing changes

### 13. **Comment Submission UX**
- **Problem**: Enter key not submitting comments, only clicking button worked
- **Solution**: Added keyboard event listener for Enter key on comment input

### 14. **File Input Styling**
- **Problem**: Native file inputs looked inconsistent across devices
- **Solution**: Hidden native inputs and used styled buttons with label-for associations

### 15. **Viewing Partner's Check-ins**
- **Problem**: Couldn't distinguish between own and partner's calendar view
- **Solution**: Implemented toggle buttons with active state indicators

### 16. **Storage Path Conflicts**
- **Problem**: Image uploads overwriting each other with same names
- **Solution**: Used unique path structure: `users/{userId}/check-ins/{date}.jpg`

### 17. **Error Messaging**
- **Problem**: Generic Firebase errors confused users
- **Solution**: Mapped error codes to user-friendly messages

### 18. **Like Double-counting**
- **Problem**: Users could like the same check-in multiple times
- **Solution**: Implemented array-based like system checking for existing userId

### 19. **Empty State Handling**
- **Problem**: Blank screens when no data existed
- **Solution**: Added placeholder messages for empty comments, no check-ins, etc.

### 20. **Logout Confirmation**
- **Problem**: Accidental logouts from misclicks
- **Solution**: Could benefit from confirmation dialog (noted for improvement)

## Security Considerations

- Firebase Security Rules should be configured to:
  - Restrict read/write access to authenticated users only
  - Validate data structure on writes
  - Prevent unauthorized profile modifications
  - Limit file upload sizes

## Browser Compatibility

- Modern browsers with ES6+ support
- iOS Safari 12+
- Chrome/Edge/Firefox latest versions
- Progressive enhancement for older browsers

## Installation

1. Clone or download the repository
2. Update `firebase-config.js` with your Firebase project credentials
3. Deploy to a web server or hosting platform (Firebase Hosting, Netlify, Vercel, etc.)
4. Configure Firebase Security Rules for production
5. Enable Authentication providers in Firebase Console
6. Create user accounts via Firebase Console

## Usage

1. Open the application in a web browser
2. Log in with authorized credentials
3. View current streaks on the login page
4. Check in daily by clicking "Check In Today" button
5. Upload a photo and optional caption
6. View partner's calendar by toggling the view
7. Like and comment on check-ins
8. Customize profile photo and display name
9. Navigate through months to view history

## Future Enhancements

- Image compression before upload
- Push notifications for check-in reminders
- Weekly/monthly statistics dashboard
- Goal setting and achievement badges
- Export workout history
- Multi-user support beyond 2 users
- Dark/light theme toggle
- Exercise type categorization
- Integration with fitness APIs
- Workout duration tracking
- Calorie/weight tracking

## License

This project is for personal use. Modify as needed for your requirements.

## Notes

- Ensure Firebase Storage and Firestore are properly configured
- Set appropriate storage limits to prevent abuse
- Regular backups of Firestore data recommended
- Monitor Firebase usage to stay within free tier limits
- Consider implementing rate limiting for uploads
