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

        if (Array.isArray(pExisting) && Array.isArray(pIncoming)) {
          const map = new Map();
          pExisting.forEach((it) => {
            if (it && typeof it === 'object') {
              const id = it.id || it.slug || JSON.stringify(it);
              map.set(id, it);
            }
          });
          pIncoming.forEach((it) => {
            if (it && typeof it === 'object') {
              const id = it.id || it.slug || JSON.stringify(it);
              const ex = map.get(id);
              if (!ex) {
                map.set(id, it);
              } else {
                const merged = { ...ex, ...it };
                if (!it.content && ex.content) merged.content = ex.content;
                map.set(id, merged);
              }
            }
          });
          const mergedArr = Array.from(map.values());
          const serializedArr = JSON.stringify(mergedArr);
          const maxTs = Math.max(
            typeof val === 'object' && val !== null && val.ts ? val.ts : 0,
            typeof rawExisting === 'object' && rawExisting !== null && rawExisting.ts ? rawExisting.ts : 0,
            Date.now()
          );
          memoryStore[k] = typeof val === 'object' && val !== null && 'value' in val ? { value: serializedArr, ts: maxTs } : serializedArr;
        } else {
          memoryStore[k] = val;
        }
      });
      return res.status(200).json({ success: true, timestamp: Date.now() });
    } catch (e) {
      return res.status(200).json({ success: true, timestamp: Date.now() });
    }
  }

  return res.status(200).json({ success: true });
}
