import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    console.log('Received URL:', url);

    if (!url) {
      console.error('No URL provided in request body');
      return res.status(400).json({ error: 'URL is required' });
    }

    let targetUrl = url;

    // If URL contains query parameters, extract the vc parameter
    if (url.includes('?')) {
      try {
        const urlObj = new URL(url);
        const vcUrl = urlObj.searchParams.get('vc');
        
        if (!vcUrl) {
          console.error('No vc parameter found in URL:', url);
          return res.status(400).json({ error: 'No credential URL found in query parameters' });
        }
        
        targetUrl = vcUrl;
      } catch (error) {
        console.error('Error parsing URL:', error);
        return res.status(400).json({ error: 'Invalid URL format' });
      }
    }

    console.log('Fetching from URL:', targetUrl);
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      console.error('Fetch failed:', response.status, response.statusText);
      return res.status(response.status).json({ error: 'Failed to fetch URL' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to fetch URL' });
  }
} 