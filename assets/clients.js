/*
  ============================================================================
  SCALEPROVE — CLIENT ACCOUNTS (front-end login gate)
  ============================================================================

  HOW THIS WORKS
  This file holds the list of clients who can log in to the "Client login"
  portal on the website and reach their tools (Listing Pulse, Brand Pulse).

  There is no server behind this — it's a plain JavaScript list, checked in
  the visitor's own browser. That makes it very easy to stand up (no backend,
  no database, works the moment you upload the files), but it is NOT secure
  in the way a real login system is. Anyone can view this file directly
  (e.g. yoursite.com/assets/clients.js) and read every email/password below.

  This is fine as a soft, "keep casual visitors out" gate for a small,
  trusted pilot client list. It is NOT fine once:
    - client tools contain sensitive/proprietary business data you don't
      want other clients (or anyone) able to guess their way into, or
    - your client list grows past a size you can manage by hand here.

  When you outgrow this, replace it with a real auth provider — Netlify
  Identity, Clerk, Auth0, Firebase Auth, or Supabase Auth are all
  inexpensive/free options that plug into a static site like this one
  without you having to run your own backend.

  ============================================================================
  HOW TO ADD / REMOVE / UPDATE A CLIENT
  ============================================================================
  Add a new { email, password, name } object to the CLIENT_ACCOUNTS array
  below, then re-upload this file to your host. That's it — no other file
  needs to change.

    - email:    what the client types into the "Email" field. Matching is
                case-insensitive.
    - password: what the client types into the "Password" field. Matching
                IS case-sensitive. Use a generated password (not something
                guessable) and share it with the client over a private
                channel (not email in plain text, ideally).
    - name:     how you want to greet them after they log in
                ("Welcome back, {name}").

  To remove a client, delete their object from the array. To change a
  password, edit the "password" value.

  The two accounts below are DEMO accounts so you can test the flow right
  now. Delete them once you've added your real pilot clients.
*/

const CLIENT_ACCOUNTS = [
  { email: "demo@scaleprove.com",        password: "Scaleprove-Demo-1",  name: "Demo Client" },
  { email: "founder@sandhusherbal.com",  password: "Sandhu-Pulse-2026",  name: "Sandhu's Herbal" }
];
