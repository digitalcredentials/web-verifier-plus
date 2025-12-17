import styles from '../Help.module.css';
import { VcDisplay } from '@/components/VcDisplay/VcDisplay';

const RevokedVCSection = () => {
  return <VcDisplay link='https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v2/dataIntegrityProof/didweb/legacy-revokedStatus-noExpiry.json' nodesToExpand={['credentialStatus']}/>
}
const UnrevokedVCSection = () => {
  return <VcDisplay link='https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v1/ed25519/didWeb/legacy-validStatus-noExpiry.json' nodesToExpand={['credentialStatus']}/>
}

const DeterminationSection = () => {
  return (

<>
        <div className={styles.preference}>For a VC with a 'credentialStatus' entry like the following: </div>
        <pre>
          {`"credentialStatus": {
    "id": "https://example.com/list/e5Wmbrj#7",
    "type": "BitstringStatusListEntry",
    "statusPurpose": "revocation",
    "statusListCredential": "https://example.com/list/e5Wmbrj",
    "statusListIndex": "7"
  }`}
    </pre>
      We retrieve the status list from the 'statusListCredential' url and then check the bit at the position indicated by 'statusListIndex'.
      If it is '1' the credential has been revoked. If it is '0' it hasn't.

<div className={styles.preference}>If there is no 'credentialStatus' property we say the credential has not been revoked. We could also say there is no revocation status, but that might confuse some people.</div>

      <div className={styles.preference}>If we can't retrieve the status list we provide a warning.</div>

      <div className={styles.preference}>See the example section for an example of a credentialStatus</div>
  
    </>)
}

const DetailsSection = () => {
  return (
    <ul className={styles.list}>
      <li>A revoked credential is considered entirely invalid.</li>
      <li>Revocation is optional - not required by Verifiable Credential data model nor the OBv3 data model.</li>
      <li>Revocation applies only to the VC, not to the underlying credential.</li>
      <li>The DCC uses the BitstringStatusList implementation.</li>
      <li>The DCC ignores any credentialStatus whose type is not BitstringStatusListEntry.</li>
    </ul>
  )
}

const NotesSection = () => {
  return (
    <>  
    <div className={styles.note}><img className={styles.infoIcon} src="./icons/info_24_lime.svg"/>A very 
    important point here is that the credentialStatus field revokes the 
    Verifiable Credential, and NOT the underlying credential. So the VC issued for a degree might be 
    revoked, but that does not imply the degree itself was revoked. It might be that the degree was 
    in fact revoked, but the credentialStatus only applies to the VC.
    </div>  

    <div className={styles.note}><img className={styles.infoIcon} src="./icons/info_24_lime.svg"/>Other approaches 
        are possible - a simple list of credential ids for example -
        but the BitstringStatusList has a good mix of pretty-good-privacy, simplicity, and especially size, for most needs.<br/><br/>
A bitstring 
        is simply a list of zeros and ones like so: 010000100. For that list, the credential that has been assigned the 
        second position and third last positions in the list have been revoked. If credentials have 
        been assigned the other positions they have not been revoked. <br/><br/>
 When a verifier is checking a given credential they ask the issuer for the entire bistring (
          which ideally is very long, so thousands of bits providing status for thousands of VCs), but without telling the 
          issuer which specific credential they are checking. This is often called 'herd-privacy'.
    </div>  

    </>
  )
}

const DescriptionSection = () => {
  return (
    <div className={styles.note}>Whether or not the credential has been revoked.</div>
  )
}

export const revocationHelpDescription = DescriptionSection()

export const revocationHelpSections  = [
  { sectionTitle: 'Details', content: DetailsSection() },
  { sectionTitle: 'How We Determine Revocation Status', content: DeterminationSection() },
  { sectionTitle: 'Example VC - revoked status', content: RevokedVCSection() },
  { sectionTitle: 'Example VC - unrevoked status', content: UnrevokedVCSection() },
  { sectionTitle: 'Notes', content: NotesSection( )}
]



