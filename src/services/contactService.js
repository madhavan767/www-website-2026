const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const DEFAULT_KEY = "7d86e3ee-ba58-4a6b-bc41-f9bc831d1a03";

export async function submitContactMessage(formData) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || DEFAULT_KEY;

  const payload = {
    access_key: accessKey,
    name: formData.name,
    email: formData.email,
    phone: formData.phone || "Not specified",
    company: formData.company || "Not specified",
    subject: formData.subject || `New enquiry from ${formData.name} (WWI Website)`,
    message: formData.message,
    from_name: "Work Wizards Innovations Website"
  };

  try {
    const response = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok && result.success !== false) {
      return { success: true, message: result.message || "Message sent successfully!" };
    }

    // Fallback using FormData if JSON parsing or proxy had an issue
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
    const fallbackRes = await fetch(WEB3FORMS_URL, {
      method: "POST",
      body: fd
    });
    const fallbackResult = await fallbackRes.json().catch(() => ({}));
    if (fallbackRes.ok && fallbackResult.success !== false) {
      return { success: true, message: fallbackResult.message || "Message sent successfully!" };
    }

    return { success: false, message: result.message || fallbackResult.message || "Failed to send message" };
  } catch (err) {
    return { success: false, message: err.message || "Network error. Please try again later." };
  }
}
