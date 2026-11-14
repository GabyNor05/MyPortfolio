// EmailJS settings (all of these are safe to be public; see EMAILJS_SETUP.md in the repo root).
export const EMAILJS = {
  serviceId: "service_isv6ltn",
  publicKey: "T-dGJiMgLi1WeYl5G",
  ownerTemplate: "template_cdojo8o", // emails YOU (new message / CV request / reminder)
  cvTemplate: "template_fd9ehsj",    // emails the person who requested your CV
};

export const emailReady = () => !!(EMAILJS.serviceId && EMAILJS.publicKey);

// Sends through EmailJS's REST API. Never throws: returns true/false.
export async function sendEmail(templateId, params) {
  if (!emailReady() || !templateId) return false;
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_id: EMAILJS.serviceId, template_id: templateId, user_id: EMAILJS.publicKey, template_params: params }),
    });
    return res.ok;
  } catch { return false; }
}

export const REMINDER_EVERY = 5; // reminder email when unresolved messages reach 5, 10, 15…

export const notifyOwner = (subject, headline, details) =>
  sendEmail(EMAILJS.ownerTemplate, { subject, headline, details });
