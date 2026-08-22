# Plan - Admin Login Page

Create a dedicated login page for administrators at `/admin/login`.

## Proposed Changes

### Frontend

#### New Route: `src/routes/admin/login.tsx`
- Create a new route for the admin login screen.
- Implement a distinct UI, possibly with a "restricted access" aesthetic (darker tones, minimalist).
- Use Supabase Auth for the login process.
- Redirect to an admin dashboard (to be created or placeholder) upon successful login.

#### Component: `SiteHeader.tsx`
- (Optional) Add a hidden or subtle link to the admin login if needed, or leave it accessible only via direct URL as requested for "admin" specific routes. I will wait for user feedback on this or just keep it accessible via URL for now to maintain security by obscurity.

### Database / Backend
- Ensure `user_roles` logic is ready for future use (though the immediate request is just the screen).

## Technical Details
- The route will be `/admin/login`.
- It will use the same Supabase authentication client but can be tailored to only allow specific domains or check roles post-login.
