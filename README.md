# LinkDonkey

Installable web app (PWA) for saved links. Hosted on GitHub Pages; login (emailed sign-in link) and sync via Supabase.

## One-time setup
1. Supabase > SQL Editor: run `schema.sql`.
2. Supabase > Authentication > URL Configuration: set Site URL to the app's address and add the same address under Redirect URLs. Sign-in emails link back there.
3. In `index.html`, set `SB_URL` and `SB_KEY` (anon / publishable key only, never the service or secret key).
4. After everyone who needs an account has signed in once, turn off new sign-ups in Supabase's auth settings.

## Install on Android
Open the site in Chrome, then choose Install app from the menu. LinkDonkey then appears in the share sheet.

## Sign-in emails
The free plan uses Supabase's default email: a sign-in link, a few emails per hour, and only to members of the Supabase organisation. Add anyone else who uses the app as an organisation member.
