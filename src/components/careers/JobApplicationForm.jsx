import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  User, 
  GraduationCap, 
  Briefcase, 
  Link as LinkIcon,
  Copy,
  Check,
  Camera
} from 'lucide-react';
import { useToast } from '../common/Toast';
import { submitJobApplication } from '../../services/applicationService';

const initialPersonal = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  currentPlace: "",
  state: "",
  country: "India"
};

const initialProfessional = {
  qualification: "",
  college: "",
  passingYear: "",
  cgpa: "",
  skills: "",
  experienceType: "Fresher", // "Fresher" | "Experienced"
  experience: "",
  currentRole: "",
  currentCompany: "",
  currentCtc: "",
  noticePeriod: "",
  expectedSalary: "",
  linkedin: "",
  github: ""
};

function isValidUrl(string) {
  try {
    const url = new URL(string.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function JobApplicationForm({ role = "General Application", jobId = null, onSuccess }) {
  const [step, setStep] = useState(1);
  const [personal, setPersonal] = useState(initialPersonal);
  const [professional, setProfessional] = useState(initialProfessional);
  const [resumeUrl, setResumeUrl] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const toast = useToast();

  const handleCopyRef = () => {
    if (!submittedRef) return;
    navigator.clipboard.writeText(submittedRef);
    setCopiedRef(true);
    toast.success("Application Reference ID copied to clipboard!");
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handleAcknowledgeAndProceed = () => {
    if (onSuccess) {
      onSuccess();
    } else if (typeof window !== 'undefined') {
      window.location.href = '/careers';
    }
  };

  const handlePersonalChange = (field, value) => {
    setPersonal((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfessionalChange = (field, value) => {
    setProfessional((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!personal.name.trim()) return "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(personal.email.trim())) return "Enter a valid email address";
    if (!/^[+\d][\d\s\-()]{6,}$/.test(personal.phone.trim())) return "Enter a valid phone number";
    if (!personal.dob) return "Date of birth is required";
    if (!personal.gender) return "Please select your gender";
    if (!personal.currentPlace.trim()) return "Current City / Location is required";
    if (!personal.state.trim()) return "State is required";
    if (!personal.country.trim()) return "Country is required";
    return null;
  };

  const validateStep2 = () => {
    if (!professional.qualification.trim()) return "Highest qualification is required";
    if (!professional.college.trim()) return "College / Institution / University is required";
    if (!professional.passingYear.trim()) return "Passing year is required";
    if (!professional.cgpa.trim()) return "CGPA or percentage is required";
    if (!professional.skills.trim()) return "Please enter your skills (e.g. React, Node, Python)";
    if (!professional.experienceType) return "Select whether you are a Fresher or Experienced";

    if (professional.experienceType === "Experienced") {
      if (!professional.experience.trim()) return "Please specify your years of experience";
      if (!professional.currentRole.trim()) return "Role title is required";
      if (!professional.currentCompany.trim()) return "Company name is required";
      if (!professional.currentCtc.trim()) return "Current CTC is required";
      if (!professional.noticePeriod.trim()) return "Notice period is required";
    }

    if (!professional.expectedSalary.trim()) return "Expected CTC is required";
    return null;
  };

  const handleNext = () => {
    const error = step === 1 ? validateStep1() : step === 2 ? validateStep2() : null;
    if (error) {
      toast.error(error);
      return;
    }
    setStep((prev) => Math.min(3, prev + 1));
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!resumeUrl || !resumeUrl.trim()) {
      toast.error("Please provide a resume URL (Cloudflare R2, Google Drive, or public PDF link)");
      return;
    }

    if (!isValidUrl(resumeUrl)) {
      toast.error("Resume URL must be a valid web link starting with http:// or https://");
      return;
    }

    if (!consent) {
      toast.error("Please check the consent confirmation to submit your application");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        role,
        jobId,
        // Step 1: Personal Details
        name: personal.name.trim(),
        email: personal.email.trim(),
        phone: personal.phone.trim(),
        dob: personal.dob,
        gender: personal.gender,
        currentPlace: personal.currentPlace.trim(),
        state: personal.state.trim(),
        country: personal.country.trim(),
        // Step 2: Education and Professional Background
        qualification: professional.qualification.trim(),
        college: professional.college.trim(),
        passingYear: professional.passingYear.trim(),
        cgpa: professional.cgpa.trim(),
        skills: professional.skills.trim(),
        experienceType: professional.experienceType,
        experience: professional.experienceType === "Experienced" ? professional.experience.trim() : "0 Years (Fresher)",
        currentRole: professional.experienceType === "Experienced" ? professional.currentRole.trim() : "N/A",
        currentCompany: professional.experienceType === "Experienced" ? professional.currentCompany.trim() : "N/A",
        currentCtc: professional.experienceType === "Experienced" ? professional.currentCtc.trim() : "N/A",
        noticePeriod: professional.experienceType === "Experienced" ? professional.noticePeriod.trim() : "Immediate",
        expectedSalary: professional.expectedSalary.trim(),
        linkedin: professional.linkedin.trim(),
        github: professional.github.trim(),
        // Step 3: Resume and Consent
        resumeUrl: resumeUrl.trim(),
        consent: true,
        consentMessage: "I confirm that all details provided are accurate and authorize WWI to process my application."
      };

      const res = await submitJobApplication(payload);
      if (res.success) {
        setSubmittedRef(res.id || "APP-2026-CONFIRMED");
        toast.success(res.message || "Application submitted successfully!");
        window.scrollTo({ top: 120, behavior: "smooth" });
      } else {
        toast.error("Failed to submit application. Please check your network.");
      }
    } catch (err) {
      toast.error("Submission error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "mt-1 w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition";

  if (submittedRef) {
    return (
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 md:p-14 text-center max-w-2xl mx-auto shadow-md animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 grid place-items-center mx-auto mb-4 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 dark:text-emerald-400">
          Application Received Successfully
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold mt-1 text-foreground">
          Thank You, {personal.name}!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Your application for <strong className="text-foreground">{role}</strong> has been securely submitted to the Work Wizards Innovations Talent Team.
        </p>

        {/* Reference ID Showcase */}
        <div className="my-6 p-5 sm:p-6 rounded-2xl bg-secondary/80 border-2 border-border text-center space-y-3">
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-muted-foreground block">
            Your Application Reference ID
          </span>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="font-mono text-xl sm:text-2xl font-black text-foreground tracking-widest bg-background px-4 py-2 rounded-xl border border-border select-all">
              {submittedRef}
            </span>
            <button
              type="button"
              onClick={handleCopyRef}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-90 transition cursor-pointer shadow-xs"
              title="Copy Reference ID"
            >
              {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedRef ? 'Copied ID!' : 'Copy Reference ID'}
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-left sm:text-center mt-3">
            <Camera className="w-4 h-4 shrink-0" />
            <span>
              <strong>Please Note Down:</strong> Take a photo, screenshot, or write down this Reference ID before leaving. You will need it to track your profile and communicate with our hiring team.
            </span>
          </div>
        </div>

        {/* Submission Summary Recap */}
        <div className="text-left bg-background/50 border border-border rounded-2xl p-4 mb-6 text-xs text-muted-foreground space-y-1.5">
          <div className="flex justify-between border-b border-border/60 pb-1.5">
            <span className="font-semibold text-foreground">Applicant Name:</span>
            <span>{personal.name}</span>
          </div>
          <div className="flex justify-between border-b border-border/60 pb-1.5">
            <span className="font-semibold text-foreground">Email Address:</span>
            <span>{personal.email}</span>
          </div>
          <div className="flex justify-between border-b border-border/60 pb-1.5">
            <span className="font-semibold text-foreground">Phone Number:</span>
            <span>{personal.phone}</span>
          </div>
          <div className="flex justify-between border-b border-border/60 pb-1.5">
            <span className="font-semibold text-foreground">Location:</span>
            <span>{personal.currentPlace}, {personal.state}</span>
          </div>
          <div className="flex justify-between pt-0.5">
            <span className="font-semibold text-foreground">Submission Status:</span>
            <span className="text-emerald-600 font-bold">New &amp; In Queue</span>
          </div>
        </div>

        {/* Explicit Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleAcknowledgeAndProceed}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-foreground text-background font-bold text-sm hover:opacity-90 transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            I Know That / I've Noted My ID — Finish
          </button>
          <a
            href="/careers"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-secondary text-foreground font-semibold text-sm hover:bg-secondary/80 transition text-center"
          >
            Browse Other Open Roles
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-sm max-w-4xl mx-auto">
      {/* Role Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-secondary/60 border border-border flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-foreground" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Applying For:</span>
          <span className="text-sm font-bold text-foreground">{role}</span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-background border border-border font-medium">
          Step {step} of 3
        </span>
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-3 gap-2 border-b border-border pb-6 mb-8">
        {[
          { num: 1, label: "Personal Details", icon: User },
          { num: 2, label: "Education & Professional", icon: GraduationCap },
          { num: 3, label: "Resume & Consent", icon: FileText }
        ].map((item) => (
          <div
            key={item.num}
            className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
              step === item.num ? "bg-secondary" : ""
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold shrink-0 transition-colors ${
                step === item.num
                  ? "bg-foreground text-background"
                  : step > item.num
                  ? "bg-emerald-600 text-white"
                  : "bg-secondary text-muted-foreground border border-border"
              }`}
            >
              {step > item.num ? <CheckCircle2 className="w-4 h-4" /> : item.num}
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block sm:hidden">
                Stage {item.num}
              </span>
              <span
                className={`text-xs font-medium truncate block hidden sm:block ${
                  step === item.num ? "text-foreground font-bold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================== */}
      {/* STAGE 1: PERSONAL DETAILS */}
      {/* ======================================================== */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <User className="w-5 h-5" /> Stage 1: Personal Details
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Please provide your personal contact information so our talent team can connect with you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name *
              </label>
              <input
                value={personal.name}
                onChange={(e) => handlePersonalChange("name", e.target.value)}
                placeholder="e.g. Aditi Sharma"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address *
              </label>
              <input
                type="email"
                value={personal.email}
                onChange={(e) => handlePersonalChange("email", e.target.value)}
                placeholder="aditi@example.com"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Phone Number *
              </label>
              <input
                type="tel"
                value={personal.phone}
                onChange={(e) => handlePersonalChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date of Birth (DOB) *
              </label>
              <input
                type="date"
                value={personal.dob}
                onChange={(e) => handlePersonalChange("dob", e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Gender *
              </label>
              <select
                value={personal.gender}
                onChange={(e) => handlePersonalChange("gender", e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current City / Location *
              </label>
              <input
                value={personal.currentPlace}
                onChange={(e) => handlePersonalChange("currentPlace", e.target.value)}
                placeholder="e.g. Hyderabad / Kakinada / Bengaluru"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                State *
              </label>
              <input
                value={personal.state}
                onChange={(e) => handlePersonalChange("state", e.target.value)}
                placeholder="e.g. Andhra Pradesh / Telangana"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Country *
              </label>
              <input
                value={personal.country}
                onChange={(e) => handlePersonalChange("country", e.target.value)}
                placeholder="e.g. India"
                className={inputClass}
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 2: EDUCATION AND PROFESSIONAL BACKGROUND */}
      {/* ======================================================== */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="w-5 h-5" /> Stage 2: Education &amp; Professional Background
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Highlight your qualifications, academic credentials, technical skills, and work experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Highest Qualification *
              </label>
              <input
                value={professional.qualification}
                onChange={(e) => handleProfessionalChange("qualification", e.target.value)}
                placeholder="e.g. B.Tech Computer Science / MCA / M.Tech"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                College / Institution / University *
              </label>
              <input
                value={professional.college}
                onChange={(e) => handleProfessionalChange("college", e.target.value)}
                placeholder="e.g. KIET Group of Institutions / JNTUK"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Passing Year *
              </label>
              <input
                value={professional.passingYear}
                onChange={(e) => handleProfessionalChange("passingYear", e.target.value)}
                placeholder="e.g. 2025 or 2024"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                CGPA / Percentage *
              </label>
              <input
                value={professional.cgpa}
                onChange={(e) => handleProfessionalChange("cgpa", e.target.value)}
                placeholder="e.g. 8.6 CGPA or 85%"
                className={inputClass}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Skills * (Comma-separated)
              </label>
              <input
                value={professional.skills}
                onChange={(e) => handleProfessionalChange("skills", e.target.value)}
                placeholder="e.g. React.js, Node.js, Python, Kotlin, Tailwind CSS, TypeScript, SQL"
                className={inputClass}
                required
              />
            </div>

            {/* Experience Level Selector: Fresher or Experienced */}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-secondary/40 border border-border">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                Experience Level *
              </label>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer">
                  <input
                    type="radio"
                    name="experienceType"
                    value="Fresher"
                    checked={professional.experienceType === "Fresher"}
                    onChange={(e) => handleProfessionalChange("experienceType", e.target.value)}
                    className="accent-foreground w-4 h-4"
                  />
                  Fresher
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer">
                  <input
                    type="radio"
                    name="experienceType"
                    value="Experienced"
                    checked={professional.experienceType === "Experienced"}
                    onChange={(e) => handleProfessionalChange("experienceType", e.target.value)}
                    className="accent-foreground w-4 h-4"
                  />
                  Experienced Professional
                </label>
              </div>
            </div>

            {/* Conditional Experienced Fields */}
            {professional.experienceType === "Experienced" && (
              <div className="sm:col-span-2 grid sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-secondary/20 border border-border">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Years of Experience *
                  </label>
                  <input
                    value={professional.experience}
                    onChange={(e) => handleProfessionalChange("experience", e.target.value)}
                    placeholder="e.g. 2.5 Years"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Current / Recent Role *
                  </label>
                  <input
                    value={professional.currentRole}
                    onChange={(e) => handleProfessionalChange("currentRole", e.target.value)}
                    placeholder="e.g. Full-Stack Developer"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Current Company Name *
                  </label>
                  <input
                    value={professional.currentCompany}
                    onChange={(e) => handleProfessionalChange("currentCompany", e.target.value)}
                    placeholder="e.g. Tech Corp India"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Current CTC *
                  </label>
                  <input
                    value={professional.currentCtc}
                    onChange={(e) => handleProfessionalChange("currentCtc", e.target.value)}
                    placeholder="e.g. ₹6.5 LPA"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Notice Period *
                  </label>
                  <input
                    value={professional.noticePeriod}
                    onChange={(e) => handleProfessionalChange("noticePeriod", e.target.value)}
                    placeholder="e.g. Immediate / 15 Days / 30 Days"
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            )}

            {/* Fields After Experience Details */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Expected CTC *
              </label>
              <input
                value={professional.expectedSalary}
                onChange={(e) => handleProfessionalChange("expectedSalary", e.target.value)}
                placeholder="e.g. ₹8,00,000 PA or Negotiable"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={professional.linkedin}
                onChange={(e) => handleProfessionalChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                GitHub / Portfolio URL
              </label>
              <input
                type="url"
                value={professional.github}
                onChange={(e) => handleProfessionalChange("github", e.target.value)}
                placeholder="https://github.com/username or your portfolio"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 3: RESUME AND CONSENT */}
      {/* ======================================================== */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5" /> Stage 3: Resume &amp; Consent
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Provide your public resume URL and complete the consent agreement to submit your application.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-secondary/40 border border-border space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Sparkles className="w-4 h-4 text-foreground" />
              Application Overview
            </div>
            <div className="text-xs text-muted-foreground grid sm:grid-cols-2 gap-2">
              <div><strong className="text-foreground">Candidate:</strong> {personal.name} ({personal.email})</div>
              <div><strong className="text-foreground">Location:</strong> {personal.currentPlace}, {personal.state}</div>
              <div><strong className="text-foreground">Qualification:</strong> {professional.qualification}</div>
              <div><strong className="text-foreground">Experience Level:</strong> {professional.experienceType} ({professional.experienceType === "Experienced" ? professional.experience : "Fresher"})</div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Resume URL (Cloudflare R2, Google Drive, Dropbox, or Public PDF link) *
            </label>
            <input
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://pub-r2.wwi.org.in/... or https://drive.google.com/..."
              className={inputClass}
              required
            />
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 shrink-0" />
              Ensure the link has public view access so our recruiters and hiring managers can open it.
            </p>
          </div>

          {/* Consent Message */}
          <label className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-background cursor-pointer hover:bg-secondary/30 transition">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 accent-foreground w-4 h-4 shrink-0"
              required
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground block mb-0.5">Consent Confirmation</strong>
              I confirm that all details provided in this application are accurate and authorize Work Wizards Innovations Pvt Ltd to process my application and review my profile for current and upcoming opportunities.
            </span>
          </label>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 mt-8 border-t border-border">
        {step > 1 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="inline-flex items-center gap-2 text-sm font-semibold border border-border rounded-xl px-5 py-2.5 hover:bg-secondary transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Previous Step
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 text-sm font-semibold bg-foreground text-background rounded-xl px-6 py-2.5 hover:opacity-90 transition cursor-pointer"
          >
            Next Step <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 text-sm font-semibold bg-foreground text-background rounded-xl px-7 py-3 hover:opacity-90 transition cursor-pointer disabled:opacity-60 shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            {isSubmitting ? "Submitting Application..." : "Submit Application"}
          </button>
        )}
      </div>
    </div>
  );
}

export default JobApplicationForm;
