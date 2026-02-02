// ====================================
// Supabase Configuration
// ====================================

// IMPORTANT: Replace these with your actual Supabase credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // e.g., 'https://xxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
let supabaseClient = null;

function initSupabase() {
    if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase initialized');
        return true;
    }
    console.warn('Supabase not configured or library not loaded');
    return false;
}

// ====================================
// Database Functions
// ====================================

/**
 * Save contact form submission to Supabase
 * @param {Object} formData - Contact form data {name, email, message}
 * @returns {Promise} - Supabase response
 */
async function saveContactSubmission(formData) {
    if (!supabaseClient) {
        console.error('Supabase not initialized');
        return { error: 'Database not configured' };
    }

    try {
        const { data, error } = await supabaseClient
            .from('contact_submissions')
            .insert([
                {
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error('Error saving contact submission:', error);
            return { error: error.message };
        }

        console.log('Contact submission saved:', data);
        return { data, error: null };
    } catch (err) {
        console.error('Exception saving contact:', err);
        return { error: err.message };
    }
}

/**
 * Save newsletter subscriber to Supabase
 * @param {string} email - Subscriber email
 * @returns {Promise} - Supabase response
 */
async function saveNewsletterSubscriber(email) {
    if (!supabaseClient) {
        console.error('Supabase not initialized');
        return { error: 'Database not configured' };
    }

    try {
        const { data, error } = await supabaseClient
            .from('newsletter_subscribers')
            .insert([
                {
                    email: email,
                    subscribed_at: new Date().toISOString(),
                    status: 'active'
                }
            ])
            .select();

        if (error) {
            // Check if it's a duplicate email error
            if (error.code === '23505') {
                return { error: 'This email is already subscribed' };
            }
            console.error('Error saving newsletter subscriber:', error);
            return { error: error.message };
        }

        console.log('Newsletter subscriber saved:', data);
        return { data, error: null };
    } catch (err) {
        console.error('Exception saving subscriber:', err);
        return { error: err.message };
    }
}

// ====================================
// Mailchimp Integration
// ====================================

// IMPORTANT: Replace with your Mailchimp credentials
const MAILCHIMP_API_KEY = 'YOUR_MAILCHIMP_API_KEY';
const MAILCHIMP_AUDIENCE_ID = 'YOUR_MAILCHIMP_AUDIENCE_ID';
const MAILCHIMP_SERVER_PREFIX = 'YOUR_SERVER_PREFIX'; // e.g., 'us1', 'us2', etc.

/**
 * Subscribe email to Mailchimp
 * Note: This requires a server-side endpoint due to CORS restrictions
 * You'll need to set up a serverless function or backend API
 * 
 * Alternative: Use Mailchimp's embedded form or popup form
 * 
 * @param {string} email - Subscriber email
 * @returns {Promise} - Response
 */
async function subscribeToMailchimp(email) {
    // Option 1: Use your backend API endpoint
    // Uncomment and configure this if you have a backend
    /*
    try {
      const response = await fetch('YOUR_BACKEND_API_URL/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Mailchimp subscription error:', error);
      return { error: error.message };
    }
    */

    // Option 2: Return success and handle manually
    // For now, we'll just save to Supabase and you can sync to Mailchimp manually or via automation
    console.log('Email saved to database. Sync with Mailchimp manually or set up Zapier/Make integration');
    return { success: true, message: 'Email saved. Mailchimp sync pending.' };
}

// ====================================
// Helper Functions
// ====================================

/**
 * Show success message to user
 * @param {string} message - Success message
 * @param {HTMLElement} container - Container element
 */
function showSuccess(message, container) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-notification';
    successDiv.style.cssText = `
    background: #d4edda;
    color: #155724;
    padding: 12px 16px;
    border-radius: 8px;
    margin: 12px 0;
    border: 1px solid #c3e6cb;
  `;
    successDiv.textContent = message;

    container.insertBefore(successDiv, container.firstChild);

    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

/**
 * Show error message to user
 * @param {string} message - Error message
 * @param {HTMLElement} container - Container element
 */
function showError(message, container) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.style.cssText = `
    background: #f8d7da;
    color: #721c24;
    padding: 12px 16px;
    border-radius: 8px;
    margin: 12px 0;
    border: 1px solid #f5c6cb;
  `;
    errorDiv.textContent = message;

    container.insertBefore(errorDiv, container.firstChild);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Initialize Supabase when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase();
}
