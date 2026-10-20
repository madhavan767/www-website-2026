/**
 * Dynamic Job Openings Service for WWI
 * Manages job postings with Cross-Subdomain synchronization, LocalStorage persistence,
 * custom slug generation, visibility toggling (hide/unhide), and real-time state synchronization.
 */

import { jobsData as initialJobsData } from '../data/jobsData.js';
import { getSharedItem, setSharedItem, removeSharedItem, subscribeSharedKey } from '../utils/storageBridge.js';

const JOBS_STORAGE_KEY = 'wwi_jobs_store_v2';
const JOBS_EVENT_NAME = 'wwi_jobs_updated';

// Helper to sanitize slugs / IDs
export function generateJobSlug(title) {
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Format default seed jobs with the newly requested fields
function seedDefaultJobs() {
  return initialJobsData.map((job) => ({
    id: job.id,
    title: job.title,
    tagline: job.shortDescription || "Build high-impact digital solutions with modern technology stacks.",
    location: job.location || "Remote / Hybrid (India)",
    employmentType: job.employmentType || "Full-Time",
    experience: job.experience || "2-4 Years",
    salary: job.salaryRange || job.salary || "Competitive Compensation",
    roleSummary: job.description || "Lead core engineering and product delivery.",
    deadline: "Open / Rolling Basis",
    qualifications: job.skills ? `Required Skills: ${job.skills}\n\nQualifications:\n- Strong problem-solving aptitude\n- Experience building production-grade web or mobile systems\n- Collaborative team player with good communication skills` : "Bachelor's or Master's degree in CS, IT, or equivalent practical experience.",
    hidden: false,
    createdAt: new Date().toISOString()
  }));
}

// Cleanup legacy v1 mock store if present
function cleanupLegacyJobStore() {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem('wwi_jobs_store_v1')) {
      localStorage.removeItem('wwi_jobs_store_v1');
      localStorage.removeItem('wwi_jobs_store_v1_ts');
      localStorage.removeItem('wwi_jobs_store_v1_initialized');
    }
  } catch {}
}

// Initialize store (Read-only, never overwrites on load)
function initializeJobStore() {
  cleanupLegacyJobStore();

  if (typeof window === 'undefined') {
    return seedDefaultJobs();
  }

  try {
    const data = getSharedItem(JOBS_STORAGE_KEY, null);
    if (data !== null && Array.isArray(data)) {
      return data;
    }
    return seedDefaultJobs();
  } catch (e) {
    console.error('Failed to read jobs from storage:', e);
    return seedDefaultJobs();
  }
}

function saveJobStore(jobs) {
  if (typeof window === 'undefined') return;
  try {
    setSharedItem(JOBS_STORAGE_KEY, jobs);
    window.dispatchEvent(new CustomEvent(JOBS_EVENT_NAME, { detail: jobs }));
  } catch (e) {
    console.error('Failed to save jobs to storage:', e);
  }
}

/**
 * Get all job postings
 * @param {Object} options
 * @param {boolean} options.includeHidden If false, excludes hidden jobs
 */
export function getJobs({ includeHidden = false } = {}) {
  const jobs = initializeJobStore();
  const filtered = includeHidden ? jobs : jobs.filter((j) => !j.hidden);

  return filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}

/**
 * Get a single job by id
 */
export function getJobById(id) {
  if (!id) return null;
  const jobs = initializeJobStore();
  return jobs.find((j) => j.id === id && !j.hidden) || jobs.find((j) => j.id === id) || null;
}

/**
 * Create a new job opening
 */
export function createJob({
  title,
  tagline,
  location,
  employmentType,
  experience,
  salary,
  roleSummary,
  deadline,
  qualifications
}) {
  const jobs = initializeJobStore();

  let cleanId = generateJobSlug(title);
  if (!cleanId) cleanId = `role-${Date.now()}`;

  let finalId = cleanId;
  let counter = 1;
  while (jobs.some((j) => j.id === finalId)) {
    finalId = `${cleanId}-${counter}`;
    counter++;
  }

  const newJob = {
    id: finalId,
    title: title.trim(),
    tagline: tagline?.trim() || "Shape next-generation digital products at Work Wizards Innovations.",
    location: location?.trim() || "Remote / Hybrid (India)",
    employmentType: employmentType || "Full-Time",
    experience: experience?.trim() || "2+ Years",
    salary: salary?.trim() || "Competitive Package",
    roleSummary: roleSummary?.trim() || "",
    deadline: deadline?.trim() || "Open / Rolling Basis",
    qualifications: qualifications?.trim() || "",
    hidden: false,
    createdAt: new Date().toISOString()
  };

  const updated = [newJob, ...jobs];
  saveJobStore(updated);
  return newJob;
}

/**
 * Update an existing job opening
 */
export function updateJob(id, updatedFields) {
  const jobs = initializeJobStore();
  const index = jobs.findIndex((j) => j.id === id);
  if (index === -1) return null;

  const existing = jobs[index];

  const updatedJob = {
    ...existing,
    ...updatedFields,
    title: updatedFields.title !== undefined ? updatedFields.title.trim() : existing.title,
    tagline: updatedFields.tagline !== undefined ? updatedFields.tagline.trim() : existing.tagline,
    location: updatedFields.location !== undefined ? updatedFields.location.trim() : existing.location,
    salary: updatedFields.salary !== undefined ? updatedFields.salary.trim() : existing.salary,
    experience: updatedFields.experience !== undefined ? updatedFields.experience.trim() : existing.experience,
    roleSummary: updatedFields.roleSummary !== undefined ? updatedFields.roleSummary.trim() : existing.roleSummary,
    deadline: updatedFields.deadline !== undefined ? updatedFields.deadline.trim() : existing.deadline,
    qualifications: updatedFields.qualifications !== undefined ? updatedFields.qualifications.trim() : existing.qualifications,
    updatedAt: new Date().toISOString()
  };

  jobs[index] = updatedJob;
  saveJobStore(jobs);
  return updatedJob;
}

/**
 * Toggle job visibility (hide/unhide)
 */
export function toggleJobVisibility(id) {
  const jobs = initializeJobStore();
  const index = jobs.findIndex((j) => j.id === id);
  if (index === -1) return null;

  jobs[index].hidden = !jobs[index].hidden;
  saveJobStore(jobs);
  return jobs[index];
}

/**
 * Delete a job opening permanently
 */
export function deleteJob(id) {
  const jobs = initializeJobStore();
  const updated = jobs.filter((j) => j.id !== id);
  saveJobStore(updated);
  return true;
}

/**
 * Subscribe to job updates across all subdomains and tabs
 */
export function subscribeToJobs(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = (updatedList) => {
    const list = Array.isArray(updatedList) ? updatedList : getJobs({ includeHidden: true });
    const sorted = [...list].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
    callback(sorted);
  };

  const unsubBridge = subscribeSharedKey(JOBS_STORAGE_KEY, handleUpdate);
  const localHandler = (e) => handleUpdate(e.detail);
  window.addEventListener(JOBS_EVENT_NAME, localHandler);

  return () => {
    unsubBridge();
    window.removeEventListener(JOBS_EVENT_NAME, localHandler);
  };
}
