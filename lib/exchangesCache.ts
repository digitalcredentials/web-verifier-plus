import { LRUCache } from 'lru-cache';
import { VC_API_EXCHANGE_TIMEOUT } from './config';

declare global {
  var exchanges: any | undefined;
}

console.log('Initializing VC-API exchanges cache.');
export const exchanges = globalThis.exchanges ||
  new LRUCache({ ttl: VC_API_EXCHANGE_TIMEOUT, ttlAutopurge: true });

globalThis.exchanges = exchanges;
