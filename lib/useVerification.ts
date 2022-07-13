import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { Credential, VerifyResponse } from "types/credential";


export const useVerification = (credential: Credential, shouldStartVerification = false) => {
  const [verifyResponse, setVerifyResponse] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(true)
  const verificationStarted = useCallback((e: Event) => {

  }, []);

  const verificationCompleted = useCallback((e: Event) => {

  }, []);

  const verifyCredential = useCallback(() => {
    fetch('/api/verify', {
      method: 'POST',
      body: JSON.stringify(credential)
    }).then((res) => {
      console.log("done!");
    });
  }, [credential]);

  useEffect(() => {
    console.log("why me?")
    window.addEventListener('verification-started', verificationStarted);
    window.addEventListener('verification-completed', verificationCompleted);
    if (shouldStartVerification) {
      verifyCredential()
    }
    return () => {
      window.removeEventListener('verification-started', verificationStarted);
      window.removeEventListener('verification-completed', verificationCompleted);
    }
  }, [])
  return { loading, verifyResponse }
}