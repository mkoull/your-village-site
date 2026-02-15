# Your Village — MVP Website

Static site. No build step. Deploy anywhere.

## Files

```
index.html          Homepage (all sections)
get-started.html    Intake form (6-step)
about.html          About page
styles.css          Shared stylesheet
netlify.toml        Netlify config (clean URLs + headers)
vercel.json         Vercel config (clean URLs + headers)
```

## Deploy to Vercel (recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. From this directory: `vercel`
3. Follow the prompts. No framework, no build command, output directory is `.`
4. Connect your domain in the Vercel dashboard.

Or: push to GitHub, connect the repo in vercel.com, deploy.

## Deploy to Netlify

1. Go to app.netlify.com
2. Drag and drop this entire folder onto the deploy area
3. Connect your domain in the Netlify dashboard.

Or: push to GitHub, connect the repo in netlify.com, deploy.

## Connect the intake form to your backend

The form currently logs submissions to the browser console. To connect it to your operations stack, open `get-started.html` and find the comment block `BACKEND INTEGRATION POINT`.

**Recommended: Zapier Webhook**

1. Create a new Zap in Zapier
2. Trigger: Webhooks by Zapier → Catch Hook
3. Copy the webhook URL
4. In `get-started.html`, replace the `console.log` and `setTimeout` block with:

```javascript
await fetch('https://hooks.zapier.com/hooks/catch/YOUR_HOOK_ID/', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

5. In Zapier, add actions:
   - Create record in Airtable (Families table)
   - Send Slack notification
   - Send email via ConvertKit/Gmail

**Alternative: Netlify Forms**

Add `netlify` attribute to the `<form>` tag and a hidden `form-name` field.
Submissions appear in the Netlify dashboard and can trigger email notifications.

## Custom domain

After deployment, connect your domain (e.g. yourvillage.com.au):

- **Vercel**: Settings → Domains → Add → follow DNS instructions
- **Netlify**: Domain settings → Add custom domain → follow DNS instructions

Both platforms provide free SSL automatically.

## Analytics

Add Plausible or Fathom analytics by inserting their script tag before `</head>` in all three HTML files.

Plausible example:
```html
<script defer data-domain="yourvillage.com.au" src="https://plausible.io/js/script.js"></script>
```

These are privacy-friendly and do not require a cookie consent banner.
