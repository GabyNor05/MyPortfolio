# EmailJS setup (about 10 minutes)

1. Sign up at emailjs.com (free plan: 200 emails/month).
2. **Email Services → Add new service → Gmail**, connect gabynorris616@gmail.com. Copy the **Service ID**.
3. **Account → API keys**: copy the **Public key**.
4. Create two templates (Email Templates → Create new template):

## Template 1: "Alert to me" (owner template)
- To email: gabynorris616@gmail.com
- Subject: `{{subject}}`
- Content:
```
{{headline}}

{{details}}

Open your dashboard: https://gabynor05.github.io/MyPortfolio/#/admin
```

## Template 2: "Send my CV" (cv template)
- To email: `{{to_email}}`
- Subject: `My CV: Gaby Norris`
- Content:
```
Hi {{to_name}},

Thank you for your interest. You can view my CV here:
{{cv_link}}

Kind regards,
Gaby Norris
Interactive Developer & UX Designer
https://gabynor05.github.io/MyPortfolio/
```

5. Copy each template's **Template ID** and fill in `frontend/src/lib/emailConfig.js`
   (serviceId, publicKey, ownerTemplate, cvTemplate), then commit.
