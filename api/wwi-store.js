/**
 * Vercel Serverless Function for /api/wwi-store
 * Provides cross-origin preflight and persistence cache for production.
 * In production on *.wwi.org.in, cross-domain cookies (.wwi.org.in)
 * and storage-hub.html iframe handle persistent cross-subdomain synchronization.
 */
let memoryStore = {};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(memoryStore);
  }

  if (req.method === 'POST') {
    try {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      Object.entries(payload).forEach(([k, val]) => {
        const rawExisting = memoryStore[k];
        let pExisting = null;
        let pIncoming = null;

        const valActual = typeof val === 'object' && val !== null && 'value' in val ? val.value : val;
        try {
          pIncoming = typeof valActual === 'string' ? JSON.parse(valActual) : valActual;
        } catch (e) {}

        if (rawExisting) {
          const exActual = typeof rawExisting === 'object' && rawExisting !== null && 'value' in rawExisting ? rawExisting.value : rawExisting;
          try {
            pExisting = typeof exActual === 'string' ? JSON.parse(exActual) : exActual;
          } catch (e) {}
        }

        const incomingTs = typeof val === 'object' && val !== null && val.ts ? val.ts : (payload[k + '_ts'] || Date.now());
        const existingTs = typeof rawExisting === 'object' && rawExisting !== null && rawExisting.ts ? rawExisting.ts : (memoryStore[k + '_ts'] || 0);

        // If incoming timestamp is newer or equal, incoming snapshot is the definitive state
        if (incomingTs >= existingTs) {
          if (Array.isArray(pExisting) && Array.isArray(pIncoming)) {
            // Strictly preserve the set of items in pIncoming so deletions stay deleted.
            // Only hydrate missing content from pExisting if pIncoming was stripped for cookies.
            const existingMap = new Map();
            pExisting.forEach((it) => {
              if (it && typeof it === 'object') {
                const id = it.id || it.slug;
                if (id) existingMap.set(id, it);
              }
            });

            const updatedIncoming = pIncoming.map((it) => {
              if (it && typeof it === 'object') {
                const id = it.id || it.slug;
                const ex = id ? existingMap.get(id) : null;
                if (!it.content && ex && ex.content) {
                  return { ...it, content: ex.content };
                }
              }
              return it;
            });

            const serializedArr = JSON.stringify(updatedIncoming);
            memoryStore[k] = typeof val === 'object' && val !== null && 'value' in val
              ? { value: serializedArr, ts: incomingTs }
              : serializedArr;
            memoryStore[k + '_ts'] = incomingTs;
          } else {
            memoryStore[k] = val;
            if (incomingTs) memoryStore[k + '_ts'] = incomingTs;
          }
        }
      });
      return res.status(200).json({ success: true, timestamp: Date.now() });
    } catch (e) {
      return res.status(200).json({ success: true, timestamp: Date.now() });
    }
  }

  return res.status(200).json({ success: true });
}
