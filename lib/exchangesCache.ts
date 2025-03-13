import { LruCache } from '@digitalcredentials/lru-memoize';
import { VC_API_EXCHANGE_TIMEOUT } from './config';

declare global {
  var exchanges: any | undefined;
}

console.log('Initializing VC-API exchanges cache.');
export const exchanges = globalThis.exchanges ||
  new LruCache({ maxAge: VC_API_EXCHANGE_TIMEOUT });

globalThis.exchanges = exchanges;
