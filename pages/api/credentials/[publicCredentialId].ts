import type { NextApiRequest, NextApiResponse } from 'next'
import * as credentials from 'lib/credentials';

/**
 * GET /api/credentials/{publicCredentialId}
 * DELETE /api/credentials/{publicCredentialId}
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('started api');
  try {
    let result: any;
    const { publicCredentialId } = req.query;
    switch (req.method) {
      case 'GET':
        console.log(`GET /credentials/${publicCredentialId}`)

        result = await credentials.get({ publicCredentialId });
        console.log('Loaded credential:', result.credential);

        res.status(200).json(result);
        break;
      case 'DELETE':
        console.log(`DELETE /credentials/${publicCredentialId}`)

        result = await credentials.unshare({ publicCredentialId, payload: req.body });
        console.log('Unshared credential.');

        res.status(200).json({ message: 'Credential unshared.' });
        break;
      default:
        res.setHeader('Allow', 'GET, DELETE');
        res.status(405).json({ status: 'Method not allowed' })
    }
  } catch (error: any) {
    console.error(error);

    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      status: error.statusText || 'Invalid request',
      // @ts-ignore
      error: error.message
    })
  }
}
