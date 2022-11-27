import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import useSWR from 'swr';
import styles from './[publicCredentialId].module.css'
import type { CredentialProps } from './[publicCredentialId].d';
import { CredentialCard } from 'components/CredentialCard/CredentialCard';
import { Container } from 'components/Container/Container';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useVerification } from 'lib/useVerification';
import { VerifiableCredential } from 'types/credential';
import { VerificationContext } from 'lib/verificationContext';
import { VerificationCard } from 'components/VerificationCard/VerificationCard';
import { TopBar } from 'components/TopBar/TopBar';
import { BottomBar } from 'components/BottomBar/BottomBar';
import { extractCredentialsFrom, VerifiableObject } from 'lib/verifiableObject';

// @see https://nextjs.org/docs/basic-features/data-fetching/client-side#client-side-data-fetching-with-swr

// think this needed to be changed because of ts https://stackoverflow.com/questions/64199630/problem-with-typescript-while-making-request-to-swr
const fetcher = (input: RequestInfo, init: RequestInit, ...args: any[]) => fetch(input, init).then((res) => res.json());

const CredentialPage: NextPage<CredentialProps> = () => {
  // TODO: probably want to find a way to extract cred then validate vs just getting cred from get return
  const [isDark, setIsDark] = useState(false);

  const router = useRouter();
  const { publicCredentialId } = router.query;
  // console.log('id: ', publicCredentialId);

  // console.log('started api call');
  const { data, error } = useSWR(`/api/credentials/${publicCredentialId}`, fetcher);
  // console.log('end of api call');
  // console.log('data: ', data);
  // console.log('error: ', error);

  let credential = undefined;
  if (data !== undefined) {
    ({ credential } = data);
    // console.log('vp: ', credential)
  }
  
  // console.log('start of verification');
  // console.log('test: ', credential);
  const credentialContext = useVerification(credential?.verifiableCredential as VerifiableCredential);
  // console.log('hre: ', credentialContext);
  // console.log('end of verification');
  
  if (error) {
    console.log('failed to load');
    return <div>Failed to load</div>;
  }
  if (!data) {
    console.log('loading');
    return <div>Loading...</div>;
  }
  
  // console.log('pres: ', credential)
  const vo: VerifiableObject = credential;
  // console.log('vo: ', vo);
  const creds = extractCredentialsFrom(vo);
  const cred = creds![0]
  
  return (
    <div className={styles.container}>
      <TopBar hasLogo={true} isDark={isDark} setIsDark={setIsDark} />
      <div className={styles.verifyContainer}>
        <VerificationContext.Provider value={credentialContext}>
          <Container>
            <CredentialCard credential={cred} />
            <VerificationCard />
          </Container>
        </VerificationContext.Provider>
      </div>
      <BottomBar isDark={isDark}/>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<CredentialProps> = async ({ params }: GetServerSidePropsContext) => {
  // TODO: Remove these mock credentials once 'useSWR' loading above is working
  if (params?.id === '1') { // verifiable
    return {
      props: {
        presentation: {
          "@context": "https://www.w3.org/2018/credentials/v1",
          "type": "VerifiablePresentation",
          "verifiableCredential": {
            "@context": [
              "https://www.w3.org/2018/credentials/v1",
              "https://w3id.org/security/suites/ed25519-2020/v1",
              "https://w3id.org/dcc/v1"
            ],
            "id": "https://cred.127.0.0.1.nip.io/api/issuance/12",
            "type": [
              "VerifiableCredential",
              "Assertion"
            ],
            "issuer": {
              "id": "did:key:z6Mktpn6cXks1PBKLMgZH2VaahvCtBMF6K8eCa7HzrnuYLZv",
              "name": "Example University",
              "image": "https://user-images.githubusercontent.com/947005/133544904-29d6139d-2e7b-4fe2-b6e9-7d1022bb6a45.png"
            },
            "issuanceDate": "2021-09-06T00:00:00.000Z",
            "credentialSubject": {
              "id": "did:example:abc123",
              "name": "Ian Malcom",
              "hasCredential": {
                "id": "https://cred.127.0.0.1.nip.io/api/claim/9c38ea72-b791-4510-9f01-9b91bab8c748",
                "name": "GT Guide",
                "type": [
                  "EducationalOccupationalCredential"
                ],
                "description": "The holder of this credential is qualified to lead new student orientations.",
                "competencyRequired": "Demonstrated knowledge of key campus locations, campus services, and student organizations.",
                "credentialCategory": "badge"
              }
            },
            "proof": {
              "type": "Ed25519Signature2020",
              "created": "2021-09-16T03:02:08Z",
              "verificationMethod": "did:key:z6Mktpn6cXks1PBKLMgZH2VaahvCtBMF6K8eCa7HzrnuYLZv#z6Mktpn6cXks1PBKLMgZH2VaahvCtBMF6K8eCa7HzrnuYLZv",
              "proofPurpose": "assertionMethod",
              "proofValue": "z4R9GDmWuFCTceHWAwKrNEqJP5D1Ay1TAANgehjCje7FgqqmTyckUu19bChDtLWjbvhVDK9YqJi2y36ETNK8SYDGf"
            }
          }
        }
      }
    };
  } else { // expired
    return {
      props: {
        presentation: {
          "@context": "https://www.w3.org/2018/credentials/v1",
          "type": "VerifiablePresentation",
          "verifiableCredential": {
            "@context": [
              "https://www.w3.org/2018/credentials/v1",
              "https://w3id.org/security/suites/ed25519-2020/v1",
              "https://w3id.org/dcc/v1"
            ],
            "id": "https://cred.127.0.0.1.nip.io/api/issuance/12",
            "type": [
              "VerifiableCredential",
              "Assertion"
            ],
            "issuer": {
              "id": "did:key:z6Mktpn6cXks1PBKLMgZH2VaahvCtBMF6K8eCa7HzrnuYLZv",
              "name": "Example University",
              "image": "https://user-images.githubusercontent.com/947005/133544904-29d6139d-2e7b-4fe2-b6e9-7d1022bb6a45.png"
            },
            "issuanceDate": "2021-09-06T00:00:00.000Z",
            expirationDate: "2021-09-06T00:00:00.000Z",
            "credentialSubject": {
              "id": "did:example:abc123",
              "name": "Ian Malcom",
              "hasCredential": {
                "id": "https://cred.127.0.0.1.nip.io/api/claim/9c38ea72-b791-4510-9f01-9b91bab8c748",
                "name": "GT Guide",
                "type": [
                  "EducationalOccupationalCredential"
                ],
                "description": "The holder of this credential is qualified to lead new student orientations.",
                "competencyRequired": "Demonstrated knowledge of key campus locations, campus services, and student organizations.",
                "credentialCategory": "badge"
              }
            },
            "proof": {
              "type": "Ed25519Signature2020",
              "created": "2021-09-16T03:02:08Z",
              "verificationMethod": "did:key:z6Mktpn6cXks1PBKLMgZH2VaahvCtBMF6K8eCa7HzrnuYLZv#z6Mktpn6cXks1PBKLMgZH2VaahvCtBMF6K8eCa7HzrnuYLZv",
              "proofPurpose": "assertionMethod",
              "proofValue": "z4R9GDmWuFCTceHWAwKrNEqJP5D1Ay1TAANgehjCje7FgqqmTyckUu19bChDtLWjbvhVDK9YqJi2y36ETNK8SYDGf"
            }
          }
        }
      }
    }
  }
}

export default CredentialPage
