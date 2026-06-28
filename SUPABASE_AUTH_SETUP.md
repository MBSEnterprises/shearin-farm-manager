# Shearin Farm Manager - Supabase Auth Setup

This version hardens account creation and email verification. The app now sends Supabase an explicit email redirect URL during account creation, verification resend, and password reset.

## Required Supabase setting

In Supabase, go to:

Authentication > URL Configuration

Set these values:

1. Site URL
   - Use the exact GitHub Pages URL where the app opens.
   - Example format: `https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY-NAME/`

2. Redirect URLs / Additional Redirect URLs
   - Add the exact auth redirect URL shown inside the app under:
   - Settings > Diagnostics > Auth redirect URL
   - It will usually look like:
   - `https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY-NAME/index.html`

## Why this matters

If the Site URL or Redirect URLs point to the wrong GitHub Pages address, the Supabase verification email can send users to a missing page that says:

"There isn't a GitHub Pages site here."

That means account creation succeeded, but the verification link returned to the wrong URL.

## Recommended test

1. Upload this v20 ZIP to GitHub.
2. Open the live app from GitHub Pages.
3. Go to Settings > Diagnostics.
4. Copy the Auth redirect URL.
5. Add that exact URL to Supabase Redirect URLs.
6. Create a new test account.
7. Open the newest verification email.
8. Confirm it returns to the app and signs in or shows the sign-in page.

## New auth features in v20

- Explicit `emailRedirectTo` on account creation.
- Explicit redirect on verification resend.
- Explicit redirect on forgot-password emails.
- Better email and password validation.
- Resend Verification Email button.
- Forgot Password button.
- Friendly auth error messages.
- Diagnostics panel showing app URL, redirect URL, Supabase URL, auth status, and app version.
