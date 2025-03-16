import { LRUCache } from 'lru-cache';
import { VC_API_EXCHANGE_TIMEOUT } from './config';

declare global {
  var exchanges: any | undefined;
}

export async function pollExchange ({ exchangeUrl, onFetchVC }:
  { exchangeUrl: string; onFetchVC: (vc: any) => void }
): Promise<void> {
  console.log('polling', exchangeUrl);
  const result = await fetch(exchangeUrl, {})

  if (result.ok && result.status === 200) {
    const vc = await result.json() as any;
    console.log('Fetched vc:', typeof vc, vc)
    onFetchVC(vc);
  }
}

export const exchanges = globalThis.exchanges ||
  new LRUCache({ ttl: VC_API_EXCHANGE_TIMEOUT, ttlAutopurge: true });

globalThis.exchanges = exchanges;
