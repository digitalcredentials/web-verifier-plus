import { createContext, useContext } from "react";
import { Credential, VerifyResponse, VerifyResult } from "types/credential";

export type VerificationContextType = {
  loading: boolean;
  verificationResult: VerifyResponse | null;
  verifyCredential: () => Promise<void>;
}

export const VerificationContext = createContext<VerificationContextType>({
  loading: true,
  verificationResult: null,
  verifyCredential: async () => {},
})

export const useVerificationContext = () => {
  return useContext(VerificationContext)
}
