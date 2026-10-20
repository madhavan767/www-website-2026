/**
 * Vercel Serverless Function for /api/wwi-store
 * Provides cross-origin preflight and graceful status for production.
 * In production on *.wwi.org.in, cross-domain cookies (.wwi.org.in)
 * and storage-hub.html iframe handle persistent cross-subdomain synchronization.
 */
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({});
  }

  return res.status(200).json({ success: true, timestamp: Date.now() });
}
