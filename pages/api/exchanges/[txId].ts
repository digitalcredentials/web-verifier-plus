import type { NextApiRequest, NextApiResponse } from 'next';

const { exchanges } = globalThis;

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
        await pollForTx(req, res, txId as string);
        break;
      case 'POST':
        const payload = JSON.stringify(req.body);
        if (payload === '{}') {
          // Initial POST by the wallet, send the VP Request query
        } else {
          // Requested credentials sent by the wallet
          // Store in the exchanges cache
        }

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

/**
 * Check to see if wallet has returned the requested VC API query response.
 * Used by the 'Request from Wallet' button.
 *
 * @param txId - Unique random transaction id polled by a browser instance.
 */
async function pollForTx(req: NextApiRequest, res: NextApiResponse, txId: string) {
  // Check the memoized exchanges cache to see if wallet has responded
  // with credentials
}

/**
 * @param txId - Unique random transaction id polled by a browser instance.
 */
async function postTx(req: NextApiRequest, res: NextApiResponse, txId: string) {

}
