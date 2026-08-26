# Contact Form Email Setup Guide

## Current Status
The contact form is configured but needs your FormSpree ID to send actual emails to `info@gondwanamining.com`.

## Setup Instructions

### Step 1: Create FormSpree Account
1. Go to https://formspree.io
2. Click "Sign up" (free tier available)
3. Create an account with your email

### Step 2: Create a New Form
1. Click "New Form"
2. Enter your email: `info@gondwanamining.com`
3. Name it: "Gondwana Mining Contact Form"
4. Click "Create"

### Step 3: Get Your Form ID
1. After creation, you'll see a form ID like: `f/xxxxx`
2. Copy this ID

### Step 4: Update the Contact Form
Edit `contact.html` and find this line (around line 198):
```html
<form class="contact-form" action="https://formspree.io/f/xyzazyab" method="POST" onsubmit="handleSubmit(event)">
```

Replace `xyzazyab` with your FormSpree ID:
```html
<form class="contact-form" action="https://formspree.io/f/YOUR_ID_HERE" method="POST" onsubmit="handleSubmit(event)">
```

### Step 5: Test It
1. Fill out the contact form
2. Click "Send Message"
3. You should receive an email at `info@gondwanamining.com`

## What Happens When Someone Submits
1. ✅ Email sent to `info@gondwanamining.com` with all form details
2. ✅ Success modal popup shown to the user
3. ✅ User's email captured for team follow-up
4. ✅ Form resets automatically

## Alternative Options (if FormSpree doesn't work for you)
- **Netlify Forms**: If you deploy on Netlify
- **AWS SES**: For higher volume
- **SendGrid**: Premium email service
- **Your own backend**: PHP/Node.js mail server

## Questions?
Contact FormSpree support at support@formspree.io
