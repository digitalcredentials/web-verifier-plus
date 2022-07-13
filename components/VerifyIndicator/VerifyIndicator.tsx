import { useVerification } from "lib/useVerification";
import { Credential } from "types/credential";

type VerifyIndicatorProps = {
  credential: Credential
}

export const VerifyIndicator = ({credential}: VerifyIndicatorProps) => {
  const {loading, verifyResponse} = useVerification(credential, true);
  return <div>Hello there!</div>
}