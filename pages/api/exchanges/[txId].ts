import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/exchanges/[txId]
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    let result: any;
    const { txId } = req.query;

    if(!txId) {
      throw new Error('Transaction id is required.');
    }

    switch (req.method) {
      case 'GET':
        // Returns a GetTransaction result
        result = { txId }
        res.status(200).json(result);
        break;
      case 'POST':
        result = { txId }
        res.status(200).json(result);
        break;
      default:
        res.setHeader('Allow', 'GET, POST');
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
