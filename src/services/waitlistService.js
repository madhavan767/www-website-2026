/**
 * WWI Waitlist & Notification Service
 * Manages subscriber emails across all waitlist & "Get Notified" touchpoints
 * (Events & Hackathons, Product Launches, General Platform Updates)
 * Integrated with WWI Cross-Subdomain Storage Bridge for instant multi-tab & multi-host synchronization.
 */

import { getSharedItem, setSharedItem, subscribeSharedKey } from '../utils/storageBridge.js';

const WAITLIST_STORAGE_KEY = 'wwi_waitlist_store_v2';
const WAITLIST_EVENT_NAME = 'wwi_waitlist_updated';

// Empty default: ready for real users and subscribers
const SEED_SUBSCRIBERS = [];

function cleanupLegacyWaitlistStore() {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem('wwi_waitlist_store_v1')) {
      localStorage.removeItem('wwi_waitlist_store_v1');
      localStorage.removeItem('wwi_waitlist_store_v1_ts');
      localStorage.removeItem('wwi_waitlist_store_v1_initialized');
    }
    if (localStorage.getItem('wwi_hackathon_notify_emails')) {
      localStorage.removeItem('wwi_hackathon_notify_emails');
    }
  } catch {}
}

function initializeWaitlist() {
  cleanupLegacyWaitlistStore();

  if (typeof window === 'undefined') {
    return SEED_SUBSCRIBERS;
  }

  try {
    const data = getSharedItem(WAITLIST_STORAGE_KEY, null);

    // If existing store exists (even if empty array []), preserve it
    if (data !== null && Array.isArray(data)) {
      return data;
    }

    return SEED_SUBSCRIBERS;
  } catch (e) {
    console.error('Failed to read waitlist from storage:', e);
    return SEED_SUBSCRIBERS;
  }
}

function saveWaitlist(list) {
  if (typeof window === 'undefined') return;
  try {
    setSharedItem(WAITLIST_STORAGE_KEY, list);
    window.dispatchEvent(new CustomEvent(WAITLIST_EVENT_NAME, { detail: list }));
  } catch (e) {
    console.error('Failed to save waitlist to storage:', e);
  }
}

/**
 * Returns all waitlist subscribers sorted by date descending (newest first).
 */
export function getWaitlist() {
  const list = initializeWaitlist();
  return list.sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return dateB - dateA;
  });
}

/**
 * Add a new subscriber to the waitlist
 * @param {string} email
 * @param {string} source (e.g. 'Promptwars Hackathon', 'Viadocs Launch', 'General Updates')
 */
export function addWaitlistSubscriber(email, source = 'General Updates') {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Invalid email address.' };
  }

  const list = initializeWaitlist();
  const cleanEmail = email.trim().toLowerCase();

  // If already exists, update source & timestamp
  const existingIdx = list.findIndex((item) => item.email.toLowerCase() === cleanEmail);
  if (existingIdx !== -1) {
    list[existingIdx].date = new Date().toISOString();
    list[existingIdx].source = source;
    saveWaitlist(list);
    return { success: true, message: "You're already on the waitlist! Your preference has been updated." };
  }

  const newEntry = {
    email: cleanEmail,
    date: new Date().toISOString(),
    source
  };

  const updated = [newEntry, ...list];
  saveWaitlist(updated);
  return { success: true, message: "Successfully added to the waitlist! We'll notify you." };
}

/**
 * Delete a subscriber from waitlist
 */
export function deleteWaitlistSubscriber(email) {
  const list = initializeWaitlist();
  const updated = list.filter((item) => item.email.toLowerCase() !== email.toLowerCase());
  saveWaitlist(updated);
  return true;
}

/**
 * Subscribe to real-time waitlist updates across all subdomains and tabs
 */
export function subscribeToWaitlist(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = (updatedList) => {
    const list = Array.isArray(updatedList) ? updatedList : getWaitlist();
    const sorted = [...list].sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA;
    });
    callback(sorted);
  };

  const unsubBridge = subscribeSharedKey(WAITLIST_STORAGE_KEY, handleUpdate);
  const localHandler = (e) => handleUpdate(e.detail);
  window.addEventListener(WAITLIST_EVENT_NAME, localHandler);

  return () => {
    unsubBridge();
    window.removeEventListener(WAITLIST_EVENT_NAME, localHandler);
  };
}
