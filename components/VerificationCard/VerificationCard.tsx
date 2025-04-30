import { ResultLog } from 'components/ResultLog/ResultLog';
import React from 'react';
import { VerificationControls } from 'components/VerificationControls/VerificationControls';
import { useVerificationContext } from 'lib/verificationContext';
import { VerifyResponse } from 'types/credential';
import styles from './VerificationCard.module.css';
import { RegistryCard } from 'components/RegistryCard/RegistryCard';


export const VerificationCard = () => {
  const { loading, verificationResult, verifyCredential } = useVerificationContext();
  const resultMessage = () => {
    const result = (verificationResult as VerifyResponse)?.results?.[0];
    const log = result?.log ?? [];


    const issuerLog = log.find(entry => entry.id === 'registered_issuer');
    const issuerWarning = issuerLog && issuerLog.valid === false;
    const verified = (verificationResult as VerifyResponse)?.verified;

    if (issuerWarning) {
      return {
        type: 'warning',
        text: 'There is a warning about this credential.'

      };
    } else if (verified) {
      return {
        type: 'success',
        text: 'This credential was verified successfully'
      };
    } else {
      return {
        type: 'error',
        text: 'This credential was not verified successfully.'
      };
    }
  };

  const { type, text } = resultMessage();

  return (
    <div className={styles.card}>
      <div className={styles.verification}>
        {
          loading ? (
            <div className={styles.loadingIndicator}>
              <span className="material-icons">sync</span>
              Verifying
            </div>
          ) : (
            <VerificationControls verificationResult={verificationResult as VerifyResponse} verifyCredential={verifyCredential} />
          )
        }
      </div>

      <div className={styles.resultLog}>
        {
          loading ? (
            <div className={styles.loadingMessage}>Please wait while we verify your credential.</div>
          ) : (
            <>
              {/* <ResultLog verificationResult={verificationResult as VerifyResponse} /> */}

              <div className={`${styles.verificationStatus} ${styles[type]}`}>
                {text}
              </div>

              <div className={styles.issuerDetails}>

                {
                  (() => {
                    const logEntry = (verificationResult as VerifyResponse).results?.[0]?.log
                      ?.find(log => log.id === 'registered_issuer');
                    const rawIssuer = (verificationResult as VerifyResponse).results?.[0]?.credential?.issuer;


                    const issuer = typeof rawIssuer === 'object' && rawIssuer !== null
                      ? (rawIssuer as { name?: string; id?: string; image?: string; legalName?: string; url?: string })
                      : undefined;


                    if (logEntry && 'foundInRegistries' in logEntry) {
                      const registries = logEntry.foundInRegistries as string[];


                      return registries.map((registry, index) => (
                        <React.Fragment key={index}>
                          <RegistryCard
                            registryName={registry}
                            issuerName={issuer?.name}
                            issuerId={issuer?.id}
                            issuerLogo={issuer?.image}
                            issuerLegalName={issuer?.legalName}
                            issuerUrl={issuer?.url}
                          />
                          {index < registries.length - 1 && <hr className={styles.divider} />}
                        </React.Fragment>
                      ));
                    }

                    //return <p>No registries found.</p>;
                  })()
                }
              </div>
            </>
          )
        }


      </div>

    </div>
  );
};


