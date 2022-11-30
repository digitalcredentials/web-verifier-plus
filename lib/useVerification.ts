import { useCallback, useEffect, useRef, useState } from 'react';
import { VerifiableCredential, VerifyResponse } from 'types/credential';
import { VerificationContextType } from './verificationContext';

export const useVerification = (credential?: VerifiableCredential) => {
  const [verificationResult, setVerificationResult] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [timerExpired, setTimerExpired] = useState(false);
  const timeout = useRef<number>();

  const verifyCredential = useCallback(async () => {
    if (credential === undefined) {
      console.log("cred was undefined in verifyCred")
      return;
    }
    setLoading(true);
    setTimerExpired(false);

    // artificial delay for UI purposes
    timeout.current = window.setTimeout(() => {
      setTimerExpired(true);
    }, 1000);
    const res = await fetch('/api/verify', {
      method: 'POST',
      body: JSON.stringify(credential)
    });

    const { result } = await res.json();
    setVerificationResult(result);
    setLoading(false);
  }, [credential]);

  useEffect(() => {
    verifyCredential()
    return () => {
      window.clearTimeout(timeout.current);
    }
  }, [verifyCredential]);

  return { loading: loading || !timerExpired, verificationResult, verifyCredential } as VerificationContextType
}
