# Supabase & Mailchimp Setup Guide

This guide will help you set up Supabase for database storage and Mailchimp for email marketing.

## Part 1: Supabase Setup

### Step 1: Create Database Tables

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the following SQL queries:

```sql
-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active'
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies to allow INSERT from anyone (for forms)
CREATE POLICY "Allow public insert on contact_submissions"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public insert on newsletter_subscribers"
  ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policies for authenticated access (for you to view data)
CREATE POLICY "Allow authenticated users to view contact_submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to view newsletter_subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);
```

###Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (this is safe to use in client-side code)

### Step 3: Update supabase-config.js

Open `supabase-config.js` and replace the placeholders:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co'; // Your actual URL
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // Your actual anon key
```

---

## Part 2: Mailchimp Setup

### Option 1: Embedded Form (Recommended - Easiest)

1. Log in to your Mailchimp account
2. Go to **Audience** > **Signup forms**
3. Select **Embedded forms**
4. Choose **Unstyled** or **Classic** form
5. Copy the generated HTML code
6. You can integrate this into your subscribe modal

### Option 2: API Integration (Requires Backend)

Mailchimp doesn't allow direct API calls from browsers due to CORS. You'll need:

**A. Serverless Function (Netlify/Vercel)**

Create a serverless function:

```javascript
// netlify/functions/subscribe.js or api/subscribe.js
const mailchimp = require('@mailchimp/mailchimp_marketing');

exports.handler = async (event) => {
  const { email } = JSON.parse(event.body);
  
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX
  });

  try {
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID,
      {
        email_address: email,
        status: 'subscribed'
      }
    );
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

**B. Zapier/Make Integration (No Code)**

1. Set up a Zap/scenario that triggers when new row is added to Supabase
2. Action: Add subscriber to Mailchimp
3. This syncs your Supabase subscribers to Mailchimp automatically

### Option 3: Manual Sync

1. Periodically export subscribers from Supabase
2. Import them into Mailchimp
3. Simple but requires manual work

---

## Part 3: Environment Variables

### Create .env File (DO NOT COMMIT TO GIT)

Create a file named `.env` in your project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
MAILCHIMP_API_KEY=your-mailchimp-api-key
MAILCHIMP_AUDIENCE_ID=your-audience-id
MAILCHIMP_SERVER_PREFIX=us1
```

### Update .gitignore

Make sure `.env` is in your `.gitignore`:

```
.env
.env.local
node_modules/
```

---

## Part 4: Testing

### Test Contact Form

1. Go to your Contact page
2. Fill out the form
3. Submit
4. Check your Supabase dashboard > Table Editor > `contact_submissions`
5. Verify the data appears

### Test Newsletter Subscription

1. Click Subscribe button
2. Enter email
3. Submit
4. Check Supabase > `newsletter_subscribers` table
5. If using Mailchimp integration, check your Mailchimp audience

---

## Part 5: Viewing Your Data

### In Supabase

1. Go to **Table Editor**
2. Select `contact_submissions` or `newsletter_subscribers`
3. View all entries

### Export Data

1. In Table Editor, click the table
2. Click the download icon
3. Export as CSV

---

## Security Notes

✅ **Safe to commit:**
- `supabase-config.js` with credentials filled in (anon key is safe for client-side)

❌ **Never commit:**
- `.env` file
- Mailchimp API keys (if using backend)
- Any secret keys

ℹ️ **Row Level Security (RLS):**
- RLS policies protect your data
- Forms can INSERT but can't SELECT without authentication
- Only you (when logged in) can view the data

---

## Troubleshooting

### Issue: "Failed to save to database"

- Check browser console for errors
- Verify Supabase URL and key are correct
- Ensure RLS policies are set up correctly
- Check that tables exist

### Issue: "Email already subscribed"

- This is expected behavior for duplicate emails
- The database prevents duplicate subscriptions
- Show friendly message to user

### Issue: Mailchimp not receiving subscribers

- If using serverless function, check function logs
- If using Zapier, check Zap history
- For manual sync, export from Supabase and import to Mailchimp

---

## Next Steps

1. Set up Supabase tables (Part 1)
2. Update `supabase-config.js` with your credentials (Part 2)
3. Choose Mail chimp integration method (Part 2)
4. Test both forms (Part 4)
5. Set up email notifications (optional)

Need help? Check the Supabase and Mailchimp documentation or reach out!
