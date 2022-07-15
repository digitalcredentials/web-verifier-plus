// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Credential } from 'types/credential';
import { ResultLog, verifyCredential } from 'lib/validate';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    // todo handle presentations
    const credential = JSON.parse(req.body) as Credential;
    const result = await verifyCredential(credential);
    console.log(result.results[0]);
    res.status(200).json({ result });
  } else {
    res.status(400).json({ status: 'Invalid Request' })
  }
}
