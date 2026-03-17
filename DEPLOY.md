# MindNexus — Complete Deployment Guide
# For someone with no coding knowledge
# Everything is free. Follow each step exactly.

=======================================================
WHAT YOU HAVE BUILT
=======================================================

MindNexus is a complete virtual counselling platform with:
- Public landing homepage
- Client portal (dashboard, mood, goals, homework, AI, messages, library)
- Therapist portal (dashboard, clients, sessions, video room, notes)
- Admin panel (overview, analytics, therapists, clients, crisis, revenue)
- AI companion powered by Claude
- Free video sessions using Jitsi Meet
- PostgreSQL database
- Secure authentication (email + password)

=======================================================
STEP 1 — CREATE YOUR FREE ACCOUNTS (15 minutes)
=======================================================

A. GitHub (stores your code)
   → Go to: github.com
   → Click "Sign up"
   → Use your email address
   → Choose the FREE plan
   → Verify your email

B. Vercel (hosts your website for free)
   → Go to: vercel.com
   → Click "Sign up"
   → Choose "Continue with GitHub"
   → Authorize Vercel to access GitHub
   → Choose the FREE Hobby plan

C. Railway (hosts your database for free)
   → Go to: railway.app
   → Click "Login with GitHub"
   → You get $5 free credit every month — enough for your database

D. Anthropic (powers the AI companion)
   → Go to: console.anthropic.com
   → Click "Sign up"
   → Verify your email
   → Go to "API Keys" in the left menu
   → Click "Create Key"
   → Copy the key — it starts with "sk-ant-..."
   → You get $5 free credit to start

=======================================================
STEP 2 — INSTALL TOOLS ON YOUR COMPUTER (20 minutes)
=======================================================

A. Install Node.js
   → Go to: nodejs.org
   → Click the big green "LTS" download button
   → Run the installer — just click Next, Next, Install
   → When done, open Terminal (Mac) or Command Prompt (Windows)
   → Type: node --version
   → You should see something like: v20.15.0

B. Install Git
   → Go to: git-scm.com/downloads
   → Download for your operating system
   → Install with default settings (just click Next)
   → Close and reopen Terminal/Command Prompt
   → Type: git --version
   → You should see: git version 2.x.x

C. Install VS Code (free code editor)
   → Go to: code.visualstudio.com
   → Download and install
   → You will use this to open your project files

=======================================================
STEP 3 — SET UP YOUR PROJECT (10 minutes)
=======================================================

1. Open Terminal (Mac) or Command Prompt (Windows)

2. Go to your Desktop:
   Mac:     cd ~/Desktop
   Windows: cd %USERPROFILE%\Desktop

3. Create a folder for your project:
   mkdir mindnexus
   cd mindnexus

4. Copy all the project files I generated into this folder.
   (The files are in the mindnexus folder from our conversation)

5. Install all the packages:
   npm install

   Wait — this downloads everything needed. Takes 2-3 minutes.

6. Generate the Prisma database code:
   npm run db:generate

=======================================================
STEP 4 — SET UP YOUR DATABASE ON RAILWAY (10 minutes)
=======================================================

1. Go to: railway.app (log in)

2. Click "New Project"

3. Click "Add a service"

4. Choose "Database" → "PostgreSQL"

5. Click on the PostgreSQL service that appears

6. Go to the "Connect" tab

7. Copy the "DATABASE_URL" — it looks like:
   postgresql://postgres:PASSWORD@HOST:PORT/railway

   Keep this — you need it in the next step.

=======================================================
STEP 5 — SET UP YOUR ENVIRONMENT VARIABLES (5 minutes)
=======================================================

1. In your project folder, find the file called: .env.example

2. Make a COPY of it and rename the copy to: .env.local

3. Open .env.local in VS Code

4. Fill in each value:

   DATABASE_URL = paste the Railway URL you copied
   
   NEXTAUTH_SECRET = open Terminal and run:
                     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
                     Copy what it prints and paste it here
   
   NEXTAUTH_URL = http://localhost:3000
   
   ANTHROPIC_API_KEY = paste your Anthropic API key (starts with sk-ant-)
   
   NEXT_PUBLIC_APP_URL = http://localhost:3000

5. Save the file

=======================================================
STEP 6 — SET UP YOUR DATABASE TABLES (5 minutes)
=======================================================

In Terminal, inside your project folder, run:

   npm run db:push

This creates all your database tables. You should see:
"The database is now in sync with your Prisma schema."

Then run the demo data:

   npm run db:seed

This creates demo accounts. You should see:
"MindNexus database seeded successfully!"

Demo accounts created:
- Admin:     admin@mindnexus.ng      / admin123
- Therapist: dr.adeyemi@mindnexus.ng / therapist123
- Client:    amara@example.com       / client123

=======================================================
STEP 7 — TEST ON YOUR COMPUTER (5 minutes)
=======================================================

In Terminal, run:
   npm run dev

Open your browser and go to: http://localhost:3000

You should see the MindNexus landing page!

Try logging in:
→ Click "Sign in"
→ Use any demo account above
→ You will be taken to the right dashboard for that role

When it works, press Ctrl+C in Terminal to stop it.

=======================================================
STEP 8 — PUSH TO GITHUB (5 minutes)
=======================================================

1. Go to: github.com (log in)

2. Click the "+" button → "New repository"

3. Name it: mindnexus

4. Leave everything else as default

5. Click "Create repository"

6. GitHub will show you a page with commands.
   Copy the URL of your repository — it looks like:
   https://github.com/YOURUSERNAME/mindnexus.git

7. In Terminal, inside your project folder, run these
   commands ONE BY ONE:

   git init
   git add .
   git commit -m "MindNexus v1.0 - Complete counselling platform"
   git branch -M main
   git remote add origin https://github.com/YOURUSERNAME/mindnexus.git
   git push -u origin main

   (Replace YOURUSERNAME with your actual GitHub username)

8. Go to github.com/YOURUSERNAME/mindnexus
   You should see all your files there!

=======================================================
STEP 9 — DEPLOY TO VERCEL (10 minutes)
=======================================================

1. Go to: vercel.com (log in)

2. Click "Add New..." → "Project"

3. Find your "mindnexus" repository and click "Import"

4. Vercel will detect it is a Next.js project automatically

5. IMPORTANT — Before clicking Deploy, click
   "Environment Variables" and add each variable:

   Name: DATABASE_URL
   Value: (paste your Railway PostgreSQL URL)

   Name: NEXTAUTH_SECRET
   Value: (paste the secret you generated)

   Name: NEXTAUTH_URL
   Value: https://your-project.vercel.app
   (Vercel will tell you this URL — you can update it after)

   Name: ANTHROPIC_API_KEY
   Value: (paste your Anthropic key)

   Name: NEXT_PUBLIC_APP_URL
   Value: https://your-project.vercel.app

6. Click "Deploy"

7. Wait 2-3 minutes while Vercel builds your project

8. When it says "Congratulations!" — your site is LIVE!

9. Click "Visit" to see your live website!

Your URL will be something like:
https://mindnexus-YOURNAME.vercel.app

=======================================================
STEP 10 — UPDATE NEXTAUTH_URL WITH YOUR REAL URL
=======================================================

1. In Vercel → go to your project → Settings → Environment Variables

2. Find NEXTAUTH_URL and update it to your actual Vercel URL:
   https://mindnexus-YOURNAME.vercel.app

3. Also update NEXT_PUBLIC_APP_URL to the same URL

4. Go to Deployments → click the three dots → "Redeploy"

5. Your site is now fully working!

=======================================================
CONGRATULATIONS — MINDNEXUS IS LIVE!
=======================================================

Your platform is now running at:
https://mindnexus-YOURNAME.vercel.app

Share this URL with:
- Your first therapists (they sign up with role THERAPIST)
- Your first clients (they sign up for free)
- Anyone you want to show your work to

=======================================================
WHAT EACH URL DOES
=======================================================

/                    → Landing homepage (public)
/auth/login          → Login page
/auth/register       → Sign up page
/client              → Client dashboard (after login as client)
/therapist           → Therapist dashboard (after login as therapist)
/admin               → Admin panel (after login as admin)

=======================================================
FUTURE UPGRADES (when you have paying clients)
=======================================================

When MindNexus starts earning money, you can upgrade:

1. Custom domain (e.g. mindnexus.ng)
   → Buy from Whogohost.com for ~₦5,000/year
   → Connect in Vercel Settings → Domains

2. More database storage
   → Upgrade Railway plan (~$5/month)

3. More AI usage
   → Add more credit to your Anthropic account

4. Professional email
   → Use Zoho Mail free tier (zoho.com/mail)

=======================================================
IF SOMETHING GOES WRONG
=======================================================

Error: "Cannot find module..."
→ Run: npm install

Error: "Database connection failed"
→ Check your DATABASE_URL in .env.local

Error: "NEXTAUTH_SECRET is not set"
→ Generate a new secret and add it to .env.local

Error: Vercel build failed
→ Check the build logs in Vercel
→ Most common fix: make sure all environment variables are set

Error: "Prisma client not generated"
→ Run: npm run db:generate

For any other issues, come back and tell me the exact
error message — I will help you fix it.

=======================================================
YOUR DEMO ACCOUNTS
=======================================================

Admin:
  Email:    admin@mindnexus.ng
  Password: admin123

Therapist:
  Email:    dr.adeyemi@mindnexus.ng
  Password: therapist123

Client:
  Email:    amara@example.com
  Password: client123

=======================================================
TOTAL COST: ₦0 (FREE)
=======================================================

GitHub:     Free forever
Vercel:     Free (Hobby plan)
Railway:    Free ($5 credit/month included)
Jitsi Meet: Free forever (open source video)
NextAuth:   Free forever (open source)
Node.js:    Free forever (open source)

Only cost: Anthropic API (~$5 starting credit, then pay-as-you-go)
The AI companion will cost roughly $1-3 per month for small usage.

=======================================================
Built with love for MindNexus
Nigeria's leading virtual counselling platform
=======================================================
