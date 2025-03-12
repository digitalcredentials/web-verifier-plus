import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/chapi/request
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        console.log('Incoming CHAPI exchange request:', req.body);

        const payload = JSON.parse(req.body) as any;

        res.status(200).json({ echo: payload });
    } else {
        res.status(400).json({ status: 'Invalid Request' })
    }
}
