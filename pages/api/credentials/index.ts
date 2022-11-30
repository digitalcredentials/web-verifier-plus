import type { NextApiRequest, NextApiResponse } from 'next'
import * as credentials from 'lib/credentials';

/**
 * POST /api/credentials
 * Adds a new credential to the database.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST':
        const credential = req.body;
        console.log('POST /credentials:', credential)

        const url = await credentials.post(req.body);
        console.log('Credential stored at:', url);

        res.setHeader('Location', url);
        res.status(201).json({ status: 'Credential added', location: url });
        break;
      default:
        res.setHeader('Allow', 'POST');
        res.status(405).json({ status: 'Method not allowed' })
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: 'Invalid request',
      // @ts-ignore
      error: error.message
    })
  }
}
