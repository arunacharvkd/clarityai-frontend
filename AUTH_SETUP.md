# ClarityAI Frontend - Authentication Setup

This project now includes Google authentication and team management features.

## Setup

### 1. Google OAuth Configuration

To enable Google Sign-In, you need to create a Google OAuth 2.0 credential:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:5173` (development)
   - `http://localhost:3000` (if using different port)
   - Your production domain

6. Copy the Client ID and create a `.env.local` file:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here
```

7. Never commit `.env.local` - it's in `.gitignore`

### 2. Backend API Endpoints Required

The authentication flow expects these endpoints:

**Authentication:**
- `POST /api/auth/google/signup` - Sign up with Google
- `POST /api/auth/google/login` - Login with Google
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

**Teams:**
- `POST /api/teams` - Create a team
- `GET /api/teams/:id` - Get team details
- `PUT /api/teams/:id` - Update team
- `POST /api/teams/:id/invite` - Invite member to team
- `DELETE /api/teams/:id/members/:userId` - Remove team member
- `PATCH /api/teams/:id/members/:userId` - Update member role

## Flow

1. **New User** → Signup with Google → Create/Join Team → Dashboard
2. **Existing User** → Login with Google → Team Selection (if needed) → Dashboard

## File Structure

```
src/
  pages/
    LoginPage.tsx           # Google login form
    SignupPage.tsx          # Google signup form
    TeamOnboardPage.tsx     # Team creation/joining
  services/
    auth.ts                 # Auth & Team API calls
  store/
    useAuthStore.ts         # Auth state management
  types/
    auth.ts                 # Auth related types
  components/
    ProtectedRoute.tsx      # Route protection HOC
```

## Protected Routes

Routes are now protected and require authentication. Use `ProtectedRoute` component:

```tsx
<ProtectedRoute requireTeam>
  <YourComponent />
</ProtectedRoute>
```

- `requireTeam={true}` - Requires both authentication and a team
- Default - Requires only authentication

## Running

```bash
npm run dev
```

Navigate to `http://localhost:5173/login` to get started.
