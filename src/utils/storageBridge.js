/**
 * WWI Universal Cross-Subdomain Storage Bridge
 * Synchronizes client data (Blogs, Job Openings, Applications, Waitlist, Settings)
 * across ALL subdomains (wwi.org.in, blog.wwi.org.in, careers.wwi.org.in, etc.)
 * using a resilient 4-layer architecture:
 *
 * 1. Root-Domain Shared Cookies (.wwi.org.in):
 *    Zero-latency synchronous cross-subdomain availability on initial page load.
 *
 * 2. Master Storage Hub Iframe (https://wwi.org.in/storage-hub.html):
 *    Shared origin localStorage bridge that synchronizes database payloads
 *    between all *.wwi.org.in subdomains without size limits.
 *
 * 3. Master Hub BroadcastChannel (wwi_master_hub_channel_v1):
 *    Instant real-time synchronization across all tabs, windows, and subdomains.
 *
 * 4. Local Storage Event & In-Memory Event Dispatcher:
 *    Immediate reactivity within the current window.
 */

const SYNC_EVENT = 'wwi_storage_bridge_sync';
const BROADCAST_NAME = 'wwi_storage_channel_v1';
const MAX_COOKIE_PAYLOAD_BYTES = 7500;
const COOKIE_CHUNK_SIZE = 2500; // 2500 chars * ~1.2 URL-encoded safe bytes = ~3000 bytes max (safe within 4096 byte cookie limit)

// Determine shared domain for cookies
export function getCookieDomain() {
  if (typeof window === 'undefined') return '';
  const host = window.location.hostname.toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost')) {
    return '';
  }
  if (host === 'wwi.org.in' || host.endsWith('.wwi.org.in')) {
    return '.wwi.org.in';
  }
  return '';
}

// Read raw cookie by name with try/catch to prevent URIError
export function getRawCookie(name) {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
    if (!match) return null;
    try {
      return decodeURIComponent(match[2]);
    } catch {
      return match[2];
    }
  } catch {
    return null;
  }
}

// Set raw cookie with cross-subdomain domain attribute
export function setRawCookie(name, value, days = 365) {
  if (typeof document === 'undefined') return;
  try {
    const domain = getCookieDomain();
    const domainStr = domain ? `; domain=${domain}` : '';
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}${domainStr}; path=/; expires=${expires}; SameSite=Lax`;
  } catch (e) {
    console.warn('Cookie write error:', name, e);
  }
}

// Delete raw cookie safely
export function deleteRawCookie(name) {
  if (typeof document === 'undefined') return;
  try {
    const domain = getCookieDomain();
    const domainStr = domain ? `; domain=${domain}` : '';
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    if (domainStr) {
      document.cookie = `${name}=${domainStr}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  } catch {}
}

/**
 * Write chunked cross-subdomain cookie for payloads up to 60KB.
 */
export function writeChunkedCookie(baseKey, dataString) {
  if (typeof document === 'undefined') return;

  let payload = dataString;
  if (payload.length > MAX_COOKIE_PAYLOAD_BYTES) {
    // If it's a JSON array, create a slim preview (without heavy content body) so cross-subdomain listing works flawlessly
    try {
      const parsed = JSON.parse(dataString);
      if (Array.isArray(parsed)) {
        const slim = parsed.map(item => {
          if (item && typeof item === 'object') {
            const { content, ...rest } = item;
            return rest;
          }
          return item;
        });
        const slimStr = JSON.stringify(slim);
        if (slimStr.length <= MAX_COOKIE_PAYLOAD_BYTES) {
          payload = slimStr;
        } else {
          console.warn(`[StorageBridge] Slim payload for ${baseKey} exceeds cookie limit.`);
          return;
        }
      } else {
        console.warn(`[StorageBridge] Payload for ${baseKey} (${dataString.length} bytes) exceeds cookie storage limit.`);
        return;
      }
    } catch {
      return;
    }
  }

  const len = payload.length;
  const totalChunks = Math.ceil(len / COOKIE_CHUNK_SIZE);

  setRawCookie(`${baseKey}_cnt`, String(totalChunks));

  for (let i = 0; i < totalChunks; i++) {
    const chunk = payload.slice(i * COOKIE_CHUNK_SIZE, (i + 1) * COOKIE_CHUNK_SIZE);
    setRawCookie(`${baseKey}_c${i}`, chunk);
  }

  // Clean up any legacy unchunked single cookie
  deleteRawCookie(baseKey);

  // Clear any old excess chunks
  for (let i = totalChunks; i < totalChunks + 10; i++) {
    deleteRawCookie(`${baseKey}_c${i}`);
  }
}

/**
 * Read chunked cross-subdomain cookie
 */
export function readChunkedCookie(baseKey) {
  if (typeof document === 'undefined') return null;
  try {
    const countStr = getRawCookie(`${baseKey}_cnt`);

    if (!countStr) {
      const single = getRawCookie(baseKey);
      return single || null;
    }

    const total = parseInt(countStr, 10);
    if (isNaN(total) || total <= 0) return null;

    let combined = '';
    for (let i = 0; i < total; i++) {
      const chunk = getRawCookie(`${baseKey}_c${i}`);
      if (chunk === null) return null; // Incomplete chunk
      combined += chunk;
    }

    return combined;
  } catch {
    return null;
  }
}

// Global broadcast channel
let broadcastChannel = null;
if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_NAME);
  } catch (e) {}
}

// Merge two array collections losslessly by unique id or slug
export function mergeArrayCollections(arrA, arrB) {
  if (!Array.isArray(arrA) && !Array.isArray(arrB)) return [];
  if (!Array.isArray(arrA)) return Array.isArray(arrB) ? arrB : [];
  if (!Array.isArray(arrB)) return Array.isArray(arrA) ? arrA : [];

  const map = new Map();
  arrA.forEach(item => {
    if (item && typeof item === 'object') {
      const id = item.id || item.slug || JSON.stringify(item);
      map.set(id, item);
    }
  });

  arrB.forEach(item => {
    if (item && typeof item === 'object') {
      const id = item.id || item.slug || JSON.stringify(item);
      const existing = map.get(id);
      if (!existing) {
        map.set(id, item);
      } else {
        const tsExisting = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
        const tsIncoming = new Date(item.updatedAt || item.createdAt || 0).getTime();
        const mergedItem = { ...existing, ...item };
        // If incoming is missing detailed content but existing had it, preserve existing content
        if (!item.content && existing.content) {
          mergedItem.content = existing.content;
        }
        if (tsIncoming >= tsExisting) {
          map.set(id, mergedItem);
        } else {
          const fallbackMerged = { ...item, ...existing };
          if (!existing.content && item.content) {
            fallbackMerged.content = item.content;
          }
          map.set(id, fallbackMerged);
        }
      }
    }
  });

  return Array.from(map.values());
}

// Storage Hub Iframe Management
let hubIframe = null;
let hubReady = false;
const pendingQueue = [];

function flushPendingQueue() {
  if (!hubReady || !hubIframe || !hubIframe.contentWindow) return;
  while (pendingQueue.length > 0) {
    const msg = pendingQueue.shift();
    try {
      hubIframe.contentWindow.postMessage(msg, '*');
    } catch (e) {}
  }
}

function ensureHubIframe() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  // NEVER create an iframe if we are already inside an iframe
  if (window.self !== window.top) return;
  if (hubIframe) return;

  const currentHost = window.location.hostname.toLowerCase();
  const isLocal = currentHost === 'localhost' || currentHost === '127.0.0.1' || currentHost.endsWith('.localhost');
  const port = window.location.port ? `:${window.location.port}` : '';

  let hubUrl = 'https://wwi.org.in/storage-hub.html';
  if (isLocal) {
    hubUrl = `http://localhost${port}/storage-hub.html`;
  } else if (currentHost.endsWith('.vercel.app')) {
    hubUrl = `${window.location.origin}/storage-hub.html`;
  }

  hubIframe = document.createElement('iframe');
  hubIframe.id = 'wwi-storage-hub-iframe';
  hubIframe.src = hubUrl;
  hubIframe.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden;pointer-events:none;';

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    if (data.type === 'WWI_HUB_READY') {
      hubReady = true;
      flushPendingQueue();
      // Request all keys from hub to sync
      try {
        hubIframe.contentWindow.postMessage({ type: 'WWI_HUB_GET_ALL' }, '*');
      } catch (e) {}
    } else if (data.type === 'WWI_HUB_ALL_RESPONSE') {
      if (data.payload && typeof data.payload === 'object') {
        Object.entries(data.payload).forEach(([k, val]) => {
          if (val && !k.endsWith('_ts') && !k.endsWith('_initialized')) {
            try {
              const remoteTsStr = data.payload[k + '_ts'];
              const remoteTs = remoteTsStr ? parseInt(remoteTsStr, 10) : 0;
              const localTsStr = localStorage.getItem(k + '_ts');
              const localTs = localTsStr ? parseInt(localTsStr, 10) : 0;
              const localVal = localStorage.getItem(k);

              let pRemote = null;
              let pLocal = null;
              try { pRemote = JSON.parse(val); } catch (e) {}
              try { pLocal = localVal ? JSON.parse(localVal) : null; } catch (e) {}

              // If both hold arrays (e.g. blogs, jobs), merge them losslessly!
              if (Array.isArray(pRemote) && Array.isArray(pLocal)) {
                const merged = mergeArrayCollections(pLocal, pRemote);
                const maxTs = Math.max(localTs, remoteTs, Date.now());
                const serialized = JSON.stringify(merged);
                localStorage.setItem(k, serialized);
                localStorage.setItem(k + '_ts', String(maxTs));
                localStorage.setItem(k + '_initialized', 'true');
                window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key: k, value: serialized, ts: maxTs } }));
              } else {
                // Non-array items: update if local has no value at all, OR if remote timestamp is strictly newer
                const shouldUpdate = (localVal === null) || (remoteTs > 0 && remoteTs > localTs);
                if (shouldUpdate) {
                  localStorage.setItem(k, val);
                  if (remoteTs) localStorage.setItem(k + '_ts', String(remoteTs));
                  localStorage.setItem(k + '_initialized', 'true');
                  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key: k, value: val, ts: remoteTs } }));
                }
              }
            } catch (err) {}
          }
        });
      }
    } else if (data.type === 'WWI_HUB_SYNC_INCOMING') {
      if (data.key && data.value !== undefined) {
        try {
          const incomingTs = data.ts ? parseInt(data.ts, 10) : 0;
          const localTsStr = localStorage.getItem(data.key + '_ts');
          const localTs = localTsStr ? parseInt(localTsStr, 10) : 0;
          const localVal = localStorage.getItem(data.key);

          let pIncoming = null;
          let pLocal = null;
          try { pIncoming = JSON.parse(data.value); } catch (e) {}
          try { pLocal = localVal ? JSON.parse(localVal) : null; } catch (e) {}

          if (Array.isArray(pIncoming) && Array.isArray(pLocal)) {
            const merged = mergeArrayCollections(pLocal, pIncoming);
            const maxTs = Math.max(localTs, incomingTs, Date.now());
            const serialized = JSON.stringify(merged);
            localStorage.setItem(data.key, serialized);
            localStorage.setItem(data.key + '_ts', String(maxTs));
            localStorage.setItem(data.key + '_initialized', 'true');
            window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key: data.key, value: serialized, ts: maxTs } }));
          } else if (incomingTs === 0 || incomingTs >= localTs) {
            localStorage.setItem(data.key, data.value);
            if (incomingTs) localStorage.setItem(data.key + '_ts', String(incomingTs));
            localStorage.setItem(data.key + '_initialized', 'true');
            window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key: data.key, value: data.value, ts: incomingTs } }));
          }
        } catch (err) {}
      }
    }
  });

  if (document.body) {
    document.body.appendChild(hubIframe);
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(hubIframe);
    });
  }
}

export function getApiStoreUrl() {
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname.toLowerCase();
    if (host === 'wwi.org.in' || host.endsWith('.wwi.org.in')) {
      return 'https://wwi.org.in/api/wwi-store';
    }
    const origin = window.location.origin || (window.location.protocol && window.location.host ? `${window.location.protocol}//${window.location.host}` : '');
    if (origin && !origin.startsWith('null') && origin !== '//undefined') {
      return `${origin}/api/wwi-store`;
    }
  }
  return 'http://localhost:3000/api/wwi-store';
}

/**
 * Server Store Synchronization (Local Dev & Multi-Subdomain Resilience)
 * Fetches /api/wwi-store and synchronizes data into localStorage across all origins and subdomains.
 */
let isSyncingServer = false;
export async function syncFromServerStore() {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return;
  if (isSyncingServer) return;
  isSyncingServer = true;

  try {
    const res = await fetch(getApiStoreUrl());
    if (!res.ok) {
      isSyncingServer = false;
      return;
    }
    const data = await res.json();
    if (!data || typeof data !== 'object') {
      isSyncingServer = false;
      return;
    }

    Object.entries(data).forEach(([k, item]) => {
      if (item !== undefined && item !== null && !k.endsWith('_ts') && !k.endsWith('_initialized')) {
        try {
          const rawVal = typeof item === 'object' && item !== null && 'value' in item ? item.value : item;
          const remoteTs = typeof item === 'object' && item !== null && 'ts' in item ? item.ts : (data[k + '_ts'] ? parseInt(data[k + '_ts'], 10) : 0);

          const serialized = typeof rawVal === 'string' ? rawVal : JSON.stringify(rawVal);
          const localVal = localStorage.getItem(k);
          const localTsStr = localStorage.getItem(k + '_ts');
          const localTs = localTsStr ? parseInt(localTsStr, 10) : 0;

          let pRemote = null;
          let pLocal = null;
          try { pRemote = JSON.parse(serialized); } catch (e) {}
          try { pLocal = localVal ? JSON.parse(localVal) : null; } catch (e) {}

          if (Array.isArray(pRemote) && Array.isArray(pLocal)) {
            const merged = mergeArrayCollections(pLocal, pRemote);
            const maxTs = Math.max(localTs, remoteTs, Date.now());
            const finalVal = JSON.stringify(merged);
            localStorage.setItem(k, finalVal);
            localStorage.setItem(k + '_ts', String(maxTs));
            localStorage.setItem(k + '_initialized', 'true');
            window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key: k, value: finalVal, ts: maxTs } }));
          } else {
            // Only update if local is missing or remote timestamp is newer or equal
            const shouldUpdate = localVal === null || (remoteTs > 0 && remoteTs >= localTs);
            if (shouldUpdate) {
              localStorage.setItem(k, serialized);
              if (remoteTs) localStorage.setItem(k + '_ts', String(remoteTs));
              localStorage.setItem(k + '_initialized', 'true');
              window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key: k, value: serialized, ts: remoteTs } }));
            }
          }
        } catch (err) {}
      }
    });
  } catch (e) {
  } finally {
    isSyncingServer = false;
  }
}

// Auto mount iframe and start sync on load in browser environments
if (typeof window !== 'undefined') {
  ensureHubIframe();
  syncFromServerStore();

  // Re-sync on tab focus and visibility change
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      syncFromServerStore();
    }
  });
  window.addEventListener('focus', () => {
    syncFromServerStore();
  });

  // Background polling every 2 seconds to keep all open tabs and subdomains synchronized
  setInterval(() => {
    syncFromServerStore();
  }, 2000);

  // Listen to cross-tab storage event
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('wwi_') && e.newValue) {
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key: e.key, value: e.newValue } }));
    }
  });

  // Listen to BroadcastChannel
  if (broadcastChannel) {
    broadcastChannel.onmessage = (e) => {
      if (e.data && e.data.key) {
        window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: e.data }));
      }
    };
  }
}

/**
 * Get shared item with cross-subdomain resolution:
 * 1. Read localStorage and timestamp
 * 2. Read chunked cross-subdomain cookies (.wwi.org.in) and timestamp
 * 3. Merge array collections losslessly so all blogs/jobs are preserved everywhere
 * 4. Fallback to defaultValue
 */
export function getSharedItem(key, defaultValue = null) {
  if (typeof window === 'undefined') return defaultValue;

  let localRaw = null;
  let localTs = 0;
  try {
    localRaw = localStorage.getItem(key);
    const tsStr = localStorage.getItem(`${key}_ts`);
    if (tsStr) localTs = parseInt(tsStr, 10) || 0;
  } catch (e) {}

  let cookieRaw = null;
  let cookieTs = 0;
  try {
    cookieRaw = readChunkedCookie(key);
    const cTsStr = getRawCookie(`${key}_ts`);
    if (cTsStr) cookieTs = parseInt(cTsStr, 10) || 0;
  } catch (e) {}

  let localParsed = null;
  if (localRaw !== null) {
    try { localParsed = JSON.parse(localRaw); } catch (e) {}
  }

  let cookieParsed = null;
  if (cookieRaw !== null) {
    try { cookieParsed = JSON.parse(cookieRaw); } catch (e) {}
  }

  // 1. If both local and cookie hold arrays (e.g. blogs, jobs), MERGE them losslessly!
  if (Array.isArray(localParsed) && Array.isArray(cookieParsed)) {
    const merged = mergeArrayCollections(localParsed, cookieParsed);
    const maxTs = Math.max(localTs, cookieTs, Date.now());
    const serialized = JSON.stringify(merged);
    try {
      localStorage.setItem(key, serialized);
      localStorage.setItem(`${key}_ts`, String(maxTs));
      localStorage.setItem(`${key}_initialized`, 'true');
      writeChunkedCookie(key, serialized);
      setRawCookie(`${key}_ts`, String(maxTs));
    } catch (e) {}
    return merged;
  }

  // 2. If local exists as an array, persist to cookie if cookie was empty or missing
  if (Array.isArray(localParsed)) {
    if (!cookieRaw && localParsed.length > 0) {
      try {
        writeChunkedCookie(key, localRaw);
        setRawCookie(`${key}_ts`, String(localTs || Date.now()));
      } catch (e) {}
    }
    return localParsed;
  }

  // 3. If cookie exists as an array, persist to local
  if (Array.isArray(cookieParsed)) {
    try {
      localStorage.setItem(key, cookieRaw);
      localStorage.setItem(`${key}_ts`, String(cookieTs || Date.now()));
      localStorage.setItem(`${key}_initialized`, 'true');
    } catch (e) {}
    return cookieParsed;
  }

  // 4. Non-array item handling
  if (cookieRaw && cookieTs > localTs) {
    try {
      localStorage.setItem(key, cookieRaw);
      localStorage.setItem(`${key}_ts`, String(cookieTs));
      localStorage.setItem(`${key}_initialized`, 'true');
      return cookieParsed !== null ? cookieParsed : cookieRaw;
    } catch (e) {}
  }

  if (localParsed !== null) return localParsed;
  if (cookieParsed !== null) return cookieParsed;

  return defaultValue;
}

/**
 * Save item across ALL subdomains:
 * 1. Write to local localStorage with timestamp
 * 2. Write to chunked cross-domain cookies (.wwi.org.in) with timestamp
 * 3. Post to Master Hub Iframe (wwi.org.in master localStorage)
 * 4. Broadcast via BroadcastChannel and dispatch CustomEvents
 */
export function setSharedItem(key, value) {
  if (typeof window === 'undefined') return;

  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  const ts = Date.now();

  // 1. Local storage (primary storage of current origin)
  try {
    localStorage.setItem(key, serialized);
    localStorage.setItem(`${key}_ts`, String(ts));
    localStorage.setItem(`${key}_initialized`, 'true');
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }

  // 2. Cross-domain cookies (.wwi.org.in)
  try {
    writeChunkedCookie(key, serialized);
    setRawCookie(`${key}_ts`, String(ts));
    setRawCookie(`${key}_initialized`, 'true');
  } catch (e) {
    console.warn('Cookie write error:', e);
  }

  // 3. Persistent Server Store Sync (/api/wwi-store)
  try {
    if (typeof fetch !== 'undefined') {
      fetch(getApiStoreUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [key]: { value: serialized, ts },
          [`${key}_ts`]: ts
        })
      }).catch(() => {});
    }
  } catch (e) {}

  // 4. Master Hub Iframe message
  const hubMessage = {
    type: 'WWI_HUB_SET',
    key,
    value: serialized,
    ts
  };

  if (hubReady && hubIframe && hubIframe.contentWindow) {
    try {
      hubIframe.contentWindow.postMessage(hubMessage, '*');
    } catch (e) {}
  } else {
    pendingQueue.push(hubMessage);
  }

  // 5. Multi-tab BroadcastChannel
  try {
    if (broadcastChannel) {
      broadcastChannel.postMessage({ key, value: serialized, ts });
    }
  } catch (e) {}

  // 6. Local event in current window
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key, value: serialized, ts } }));
}

/**
 * Remove shared item across all subdomains
 */
export function removeSharedItem(key) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_ts`);
    localStorage.removeItem(`${key}_initialized`);
  } catch (e) {}

  try {
    deleteRawCookie(key);
    deleteRawCookie(`${key}_cnt`);
    deleteRawCookie(`${key}_ts`);
    deleteRawCookie(`${key}_initialized`);
    for (let i = 0; i < 20; i++) {
      deleteRawCookie(`${key}_c${i}`);
    }
  } catch (e) {}

  try {
    if (typeof fetch !== 'undefined') {
      const ts = Date.now();
      fetch(getApiStoreUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [key]: { value: '[]', ts },
          [`${key}_ts`]: ts
        })
      }).catch(() => {});
    }
  } catch (e) {}

  const hubMessage = {
    type: 'WWI_HUB_SET',
    key,
    value: '',
    ts: Date.now()
  };

  if (hubReady && hubIframe && hubIframe.contentWindow) {
    try {
      hubIframe.contentWindow.postMessage(hubMessage, '*');
    } catch (e) {}
  } else {
    pendingQueue.push(hubMessage);
  }

  try {
    if (broadcastChannel) {
      broadcastChannel.postMessage({ key, value: null });
    }
  } catch (e) {}

  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key, value: null } }));
}

/**
 * Subscribe to changes for a specific key
 */
export function subscribeSharedKey(key, callback) {
  if (typeof window === 'undefined') return () => {};

  const handler = (e) => {
    if (e.detail && e.detail.key === key) {
      try {
        const parsed = typeof e.detail.value === 'string' ? JSON.parse(e.detail.value) : e.detail.value;
        callback(parsed);
      } catch (err) {
        callback(e.detail.value);
      }
    }
  };

  window.addEventListener(SYNC_EVENT, handler);
  return () => {
    window.removeEventListener(SYNC_EVENT, handler);
  };
}
