import React, { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { useToast } from './Toast';
import { submitContactMessage } from '../../services/contactService';

const initialValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  subject: "",
  message: ""
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d][\d\s\-()]{6,}$/;

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!values.name.trim() || values.name.trim().length < 2) {
      errs.name = "Please enter your name";
    }
    if (!values.email.trim() || !EMAIL_REGEX.test(values.email.trim())) {
      errs.email = "Please enter a valid email";
    }
    if (values.phone.trim() && !PHONE_REGEX.test(values.phone.trim())) {
      errs.phone = "Please enter a valid phone number";
    }
    if (!values.message.trim() || values.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await submitContactMessage(values);
      if (res.success) {
        toast.success("Message sent successfully");
        setValues(initialValues);
        setErrors({});
      } else {
        toast.error(res.message || "Failed to send message");
      }
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "mt-1 w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-foreground transition";

  return (
    <form onSubmit={handleSubmit} className="p-7 rounded-2xl bg-card border border-border space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Name *
          </label>
          <input
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Your name"
            className={inputClass}
            autoComplete="name"
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Email *
          </label>
          <input
            type="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="you@email.com"
            className={inputClass}
            autoComplete="email"
          />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Phone
          </label>
          <input
            type="tel"
            value={values.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+91 00000 00000"
            className={inputClass}
            autoComplete="tel"
          />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Company
          </label>
          <input
            value={values.company}
            onChange={(e) => handleChange("company", e.target.value)}
            placeholder="Company name"
            className={inputClass}
            autoComplete="organization"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Subject
        </label>
        <input
          value={values.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          placeholder="What's this about?"
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Message *
        </label>
        <textarea
          rows={4}
          value={values.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Tell us about your project..."
          className={`${inputClass} resize-none`}
        />
        {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

export default ContactForm;
