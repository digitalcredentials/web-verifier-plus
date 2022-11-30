import type { NextApiRequest, NextApiResponse } from 'next'
import * as credentials from 'lib/credentials';

/**
 * GET /api/credentials/{publicCredentialId}
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('started api');
  try {
    switch (req.method) {
      case 'GET':
        const { publicCredentialId } = req.query;
        console.log(`GET /credentials/${publicCredentialId}`)

        const result: any = await credentials.get({ publicCredentialId });
        console.log('Loaded credential:', result.credential);

        res.status(200).json(result);
        break;
      default:
        res.setHeader('Allow', 'GET');
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
