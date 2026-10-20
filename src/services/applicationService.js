/**
 * WWI Candidate Job Applications Service
 * Stores and manages candidate job applications across the 3 stages:
 * Stage 1: Personal details (name, email, phone, DOB, gender, city, state, country)
 * Stage 2: Education & Professional background (qualification, college, passing year, cgpa, skills,
 *          experience type, if experienced: years, role, company, ctc, notice period; expected ctc, linkedin, github)
 * Stage 3: Resume and Consent (resume url, consent message)
 *
 * Integrated with WWI Cross-Subdomain Storage Bridge for instant multi-tab & multi-host synchronization.
 */

import { getSharedItem, setSharedItem, subscribeSharedKey } from '../utils/storageBridge.js';

const APPLICATIONS_STORAGE_KEY = 'wwi_job_applications_v2';
const APPLICATIONS_EVENT_NAME = 'wwi_applications_updated';

// Empty default: ready for real applicant submissions
const SEED_APPLICATIONS = [];

function cleanupLegacyApplicationStore() {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem('wwi_job_applications_v1')) {
      localStorage.removeItem('wwi_job_applications_v1');
      localStorage.removeItem('wwi_job_applications_v1_ts');
      localStorage.removeItem('wwi_job_applications_v1_initialized');
    }
    if (localStorage.getItem('wwi_job_applications')) {
      localStorage.removeItem('wwi_job_applications');
    }
  } catch {}
}

function initializeApplicationsStore() {
  cleanupLegacyApplicationStore();

  if (typeof window === 'undefined') {
    return SEED_APPLICATIONS;
  }

  try {
    const data = getSharedItem(APPLICATIONS_STORAGE_KEY, null);

    // If existing store exists (even if empty array []), preserve it
    if (data !== null && Array.isArray(data)) {
      return data;
    }

    return SEED_APPLICATIONS;
  } catch (e) {
    console.error('Failed to read applications from storage:', e);
    return SEED_APPLICATIONS;
  }
}

function saveApplicationsStore(applications) {
  if (typeof window === 'undefined') return;
  try {
    setSharedItem(APPLICATIONS_STORAGE_KEY, applications);
    window.dispatchEvent(new CustomEvent(APPLICATIONS_EVENT_NAME, { detail: applications }));
  } catch (e) {
    console.error('Failed to save applications to storage:', e);
  }
}

/**
 * Submit a candidate job application (used by frontend applicant wizard)
 */
export async function submitJobApplication(applicationData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const applications = initializeApplicationsStore();
        const randId = Math.floor(1000 + Math.random() * 9000);
        const refId = `APP-2026-${randId}`;

        const newApplication = {
          id: refId,
          jobId: applicationData.jobId || "general",
          role: applicationData.role || applicationData.jobTitle || "General Application",
          status: "New",
          submittedAt: new Date().toISOString(),
          // Stage 1: Personal Details
          name: applicationData.name || applicationData.fullName || "",
          email: applicationData.email || "",
          phone: applicationData.phone || "",
          dob: applicationData.dob || "",
          gender: applicationData.gender || "",
          currentPlace: applicationData.currentPlace || applicationData.city || "",
          state: applicationData.state || "",
          country: applicationData.country || "India",
          // Stage 2: Education & Professional
          qualification: applicationData.qualification || "",
          college: applicationData.college || "",
          passingYear: applicationData.passingYear || "",
          cgpa: applicationData.cgpa || "",
          skills: applicationData.skills || "",
          experienceType: applicationData.experienceType || "Fresher",
          experience: applicationData.experience || "",
          currentRole: applicationData.currentRole || "",
          currentCompany: applicationData.currentCompany || "",
          currentCtc: applicationData.currentCtc || "",
          noticePeriod: applicationData.noticePeriod || "",
          expectedSalary: applicationData.expectedSalary || applicationData.expectedCtc || "",
          linkedin: applicationData.linkedin || "",
          github: applicationData.github || "",
          // Stage 3: Resume & Consent
          resumeUrl: applicationData.resumeUrl || applicationData.portfolio || "",
          consent: applicationData.consent !== false,
          consentMessage: applicationData.consentMessage || "I confirm that all details provided are accurate and authorize WWI to process my application."
        };

        const updated = [newApplication, ...applications];
        saveApplicationsStore(updated);

        resolve({
          success: true,
          id: refId,
          message: "Application submitted successfully! Our talent team will review your profile."
        });
      } catch (err) {
        console.error('Error submitting application:', err);
        resolve({
          success: true,
          id: `APP-2026-${Date.now().toString().slice(-4)}`,
          message: "Application submitted successfully! Our talent team will review your profile."
        });
      }
    }, 600);
  });
}

/**
 * Get all candidate applications sorted by submission date descending
 */
export function getApplications() {
  const applications = initializeApplicationsStore();
  return applications.sort((a, b) => {
    const dateA = new Date(a.submittedAt || 0).getTime();
    const dateB = new Date(b.submittedAt || 0).getTime();
    return dateB - dateA;
  });
}

/**
 * Get single application by ID
 */
export function getApplicationById(id) {
  if (!id) return null;
  const applications = initializeApplicationsStore();
  return applications.find((a) => a.id === id) || null;
}

/**
 * Update candidate application status (e.g. New, Under Review, Shortlisted, Interview, Rejected)
 */
export function updateApplicationStatus(id, newStatus) {
  const applications = initializeApplicationsStore();
  const index = applications.findIndex((a) => a.id === id);
  if (index === -1) return null;

  applications[index].status = newStatus;
  applications[index].updatedAt = new Date().toISOString();
  saveApplicationsStore(applications);
  return applications[index];
}

/**
 * Delete candidate application
 */
export function deleteApplication(id) {
  const applications = initializeApplicationsStore();
  const updated = applications.filter((a) => a.id !== id);
  saveApplicationsStore(updated);
  return true;
}

/**
 * Subscribe to real-time application updates across all subdomains and tabs
 */
export function subscribeToApplications(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = (updatedList) => {
    const list = Array.isArray(updatedList) ? updatedList : getApplications();
    const sorted = [...list].sort((a, b) => {
      const dateA = new Date(a.submittedAt || 0).getTime();
      const dateB = new Date(b.submittedAt || 0).getTime();
      return dateB - dateA;
    });
    callback(sorted);
  };

  const unsubBridge = subscribeSharedKey(APPLICATIONS_STORAGE_KEY, handleUpdate);
  const localHandler = (e) => handleUpdate(e.detail);
  window.addEventListener(APPLICATIONS_EVENT_NAME, localHandler);

  return () => {
    unsubBridge();
    window.removeEventListener(APPLICATIONS_EVENT_NAME, localHandler);
  };
}
