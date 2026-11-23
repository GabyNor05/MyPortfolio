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


## 3. Your email signature inside the EmailJS emails
Images in email must be **PNG or JPG hosted online** (SVG is blocked by Gmail and Outlook). To make an image clickable you wrap it in a link: `<a href="https://gabynor05.github.io/MyPortfolio/"><img ...></a>`. The signature below does that for the photo and the corner logo, and has real text links (Visit website, GitHub, Behance, LinkedIn).

How to use it: in EmailJS, open the template, switch to the **Code editor**, and paste the block below just before the final closing `</div></div>` of the template (under "Kind regards"). Do this for both templates. The images load from your live site (`/brand/`), so they stay available as long as the site is online.

```html
<table cellpadding="0" cellspacing="0" border="0" style="background:#15122a;border-radius:8px;font-family:Roboto,Arial,sans-serif;width:560px;">
  <tr>
    <td style="padding:20px 8px 20px 20px;vertical-align:top;width:104px;">
      <a href="https://gabynor05.github.io/MyPortfolio/"><img src="https://gabynor05.github.io/MyPortfolio/brand/gaby-circle.png" width="96" height="96" alt="Gaby Norris" style="display:block;border-radius:48px;border:0;"></a>
    </td>
    <td style="padding:20px 8px 20px 12px;vertical-align:top;">
      <div style="font-size:22px;font-weight:bold;color:#ede9ff;line-height:1.2;">Gaby Norris</div>
      <div style="font-size:14px;color:#ba9fe1;font-weight:bold;padding-top:2px;">Developer / User Experience Designer</div>
      <div style="font-size:12px;color:#b8b0d8;padding-top:2px;">Final year · Bachelor of Creative Technologies</div>
      <div style="font-size:13px;color:#ede9ff;padding-top:10px;">
        <a href="mailto:gabriellenor05@gmail.com" style="color:#ede9ff;text-decoration:none;">gabriellenor05@gmail.com</a> &nbsp;·&nbsp; +27 82 777 3260
      </div>
      <div style="font-size:13px;padding-top:8px;color:#b8b0d8;">
        <a href="https://gabynor05.github.io/MyPortfolio/" style="color:#ba9fe1;text-decoration:underline;">Visit website</a> &nbsp;·&nbsp;
        <a href="https://github.com/GabyNor05" style="color:#ba9fe1;text-decoration:underline;">GitHub</a> &nbsp;·&nbsp;
        <a href="https://www.behance.net/gabynorris1" style="color:#ba9fe1;text-decoration:underline;">Behance</a> &nbsp;·&nbsp;
        <a href="https://www.linkedin.com/in/gaby-norris" style="color:#ba9fe1;text-decoration:underline;">LinkedIn</a>
      </div>
    </td>
    <td style="vertical-align:bottom;width:130px;padding:0;">
      <a href="https://gabynor05.github.io/MyPortfolio/"><img src="https://gabynor05.github.io/MyPortfolio/brand/sig-corner.png" width="130" height="85" alt="Visit my portfolio" style="display:block;border-bottom-right-radius:8px;border:0;"></a>
    </td>
  </tr>
</table>

```
To change the photo, replace `frontend/public/brand/gaby-circle.png` in the repo (or put the photo URL from the Figma export in the `src`). Use the Figma export of the dark signature as a PNG if you prefer a single image: host it in `/brand/` and wrap it the same way, but text links inside a flat image are not individually clickable, so the table version above is recommended.

## 3. Reply template (admin "Reply by email")
Create a third EmailJS template, then paste its ID in Site settings, Uploads, "EmailJS reply template ID".
- To email: `{{to_email}}`
- Subject: `{{subject}}`
- Fields used: `{{to_name}}`, `{{reply}}` (what you type), `{{their_message}}` (their original message, quoted underneath).
Suggested body: "Hi {{to_name}}, {{reply}}" then a quote block "You wrote: {{their_message}}", then the signature block from section 2.
