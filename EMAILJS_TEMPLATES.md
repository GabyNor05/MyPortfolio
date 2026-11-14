# EmailJS templates in the site's style

In EmailJS: Email Templates → open the template → **Edit Content → Code Editor (`<>`)** → paste the HTML → Save.
Settings for each template: set "To email" and "Subject" as below.

## 1. Alert to me (template_cdojo8o)
- To email: gabynorris616@gmail.com
- Subject: `{{subject}}`

```html
<div style="background:#0e0c1a;padding:28px 12px;font-family:Roboto,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#15122a;border:2px solid #ba9fe1;border-radius:12px;overflow:hidden;">
    <div style="padding:18px 24px;border-bottom:1px solid rgba(186,159,225,.35);">
      <span style="color:#ba9fe1;font-size:12px;letter-spacing:.18em;text-transform:uppercase;">Portfolio · new raven</span>
    </div>
    <div style="padding:24px;">
      <h1 style="margin:0 0 10px;color:#ede9ff;font-size:22px;font-weight:500;">{{headline}}</h1>
      <p style="margin:0 0 22px;color:#c4c5e8;font-size:16px;line-height:1.6;white-space:pre-wrap;">{{details}}</p>
      <a href="https://gabynor05.github.io/MyPortfolio/#/admin" style="display:inline-block;background:#ba9fe1;color:#14102a;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:.1em;text-transform:uppercase;padding:12px 20px;border-radius:4px;">Open dashboard</a>
    </div>
  </div>
</div>
```

## 2. Send my CV (template_fd9ehsj)
- To email: `{{to_email}}`
- Subject: `My CV: Gaby Norris`
- New field used: `{{personal_message}}` (your personal note, typed in the admin page for each request). Others: `{{to_name}}`, `{{cv_link}}`, `{{interest}}`.

```html
<div style="background:#0e0c1a;padding:28px 12px;font-family:Roboto,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#15122a;border:2px solid #ba9fe1;border-radius:12px;overflow:hidden;">
    <div style="padding:18px 24px;border-bottom:1px solid rgba(186,159,225,.35);">
      <span style="color:#ede9ff;font-size:20px;font-weight:500;">Gaby Norris</span>
      <span style="color:#ba9fe1;font-size:13px;letter-spacing:.14em;text-transform:uppercase;"> &nbsp;·&nbsp; Developer / UX Designer</span>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 14px;color:#ede9ff;font-size:17px;">Hi {{to_name}},</p>
      <p style="margin:0 0 20px;color:#c4c5e8;font-size:16px;line-height:1.65;white-space:pre-wrap;">{{personal_message}}</p>
      <p style="margin:0 0 20px;color:#c4c5e8;font-size:16px;line-height:1.65;">Here is the version of my CV that fits what you're looking for ({{interest}}).</p>
      <a href="{{cv_link}}" style="display:inline-block;background:#ba9fe1;color:#14102a;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:.1em;text-transform:uppercase;padding:12px 20px;border-radius:4px;">View my CV</a>
      <p style="margin:26px 0 0;color:#c4c5e8;font-size:16px;line-height:1.65;">Kind regards,<br><b style="color:#ede9ff;">Gaby Norris</b><br>
        <a href="https://gabynor05.github.io/MyPortfolio/" style="color:#ba9fe1;">Visit my portfolio</a></p>
    </div>
  </div>
</div>
```
Note: say "linked below" rather than "attached" if you prefer; the CV is sent as a link, not an attachment.
