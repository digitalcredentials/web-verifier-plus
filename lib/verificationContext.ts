import { createContext, useContext } from "react";
import { Credential, VerifyResult } from "types/credential";

export type VerificationContextType = {
  loading: boolean;
  verificationResult: VerifyResult | null;
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
