import { VerifyResult } from "types/credential";

export type VerificationControlsProps = {
  verificationResult: VerifyResult;
  verifyCredential: () => Promise<void>;
}