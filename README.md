# Coach Tejaswi Website

A clean, minimalist website for Tejaswi Khanna — writer, coach, and storyteller.

## About

This website showcases the books, writings, and philosophy of Coach Tejaswi. Built with vanilla HTML, CSS, and JavaScript for simplicity and performance.

## Features

- **Shared Styles**: Centralized CSS variables and modern design system
- **Modern Animations**: Smooth scroll effects and fade-in animations
- **Responsive Design**: Mobile-first approach with breakpoints
- **SEO Optimized**: Meta tags, sitemap, and robots.txt
- **Form Integration**: Supabase database for storing submissions
- **Newsletter**: Mailchimp integration for email marketing
- **Accessibility**: ARIA labels and semantic HTML

## Technology Stack

- HTML5, CSS3, JavaScript (Vanilla)
- Google Fonts (Playfair Display, Inter)
- Supabase for database storage
- Mailchimp for email marketing

## Database Integration

This website uses **Supabase** to store form submissions and newsletter subscribers.

### Setup Instructions

1. **Create Supabase Account**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project

2. **Run SQL Setup**
   - See `SETUP_GUIDE.md` for complete SQL queries
   - Creates `contact_submissions` and `newsletter_subscribers` tables

3. **Configure Credentials**
   - Open `supabase-config.js`
   - Replace `YOUR_SUPABASE_URL` with your project URL
   - Replace `YOUR_SUPABASE_ANON_KEY` with your anon key

4. **Test Integration**
   - Submit the contact form
   - Subscribe to newsletter
   - Check Supabase dashboard to verify data

### Mailchimp Integration

For newsletter management, you can integrate with Mailchimp:

**Option 1: Embedded Form** (Easiest)
- Use Mailchimp's embedded form code

**Option 2: API Integration** (Recommended)
- Set up serverless function (Netlify/Vercel)
- Or use Zapier/Make to sync Supabase → Mailchimp

See `SET UP_GUIDE.md` for detailed instructions.

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/tejaswikhanna/coachtejaswi-website.git
   cd coachtejaswi-website
   ```

2. Configure Supabase:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials in `supabase-config.js`

3. Run a local server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve

   # Using PHP
   php -S localhost:8000
   ```

4. Visit `http://localhost:8000` in your browser

## Deployment

This is a static website that can be deployed to any hosting platform:

- **Netlify**: Drag and drop the folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Enable in repository settings
- **Cloudflare Pages**: Connect repository

**Important**: Make sure to update `supabase-config.js` with your credentials before deploying.

## Contact Form

- Uses Supabase to store submissions
- Form validation included
- Success/error messages displayed
- All submissions stored in `contact_submissions` table

## Newsletter

- Subscribe modal on all pages
- Stores email in Supabase `newsletter_subscribers` table
- Prevents duplicate subscriptions
- Can be synced with Mailchimp for email campaignserved.

## Books Featured

1. **Embracing Failure** - Available now on Amazon, Flipkart, and Notion Press
2. **Awaken Each Day** - Coming December 2025

## Pages

- **Home** (`index.html`) - Hero banner and featured content
- **Books** (`books.html`) - Detailed book showcase with purchase links
- **About** (`about.html`) - Personal story and philosophy
- **Contact** (`contact.html`) - Get in touch form and information

## Social Media

- **LinkedIn**: [tejaswikhanna](https://www.linkedin.com/in/tejaswikhanna)
- **Instagram**: [@coachtejaswi](https://instagram.com/coachtejaswi)

## License

© 2026 Tejaswi Khanna. All rights reserved.
