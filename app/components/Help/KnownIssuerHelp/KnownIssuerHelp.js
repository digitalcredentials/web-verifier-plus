import styles from '../Help.module.css';
import { VcDisplay } from '@/components/VcDisplay/VcDisplay';

const DidKeyVCSection = () => {
  return <VcDisplay link='https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v2/dataIntegrityProof/didKey/legacyRegistry-noStatus-noExpiry-credSubjName.json' nodesToExpand={['proof', 'proof.verificationMethod']} />
}

const DidWebVCSection = () => {
  return <VcDisplay link='https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v2/dataIntegrityProof/didweb/oidf-noStatus-notExpired.json' nodesToExpand={['proof', 'proof.verificationMethod']} />
}

const DeterminationSection = () => {
  return (
    <div>
      <ul className={styles.list}>
        <li>VerifierPlus looks up the signing DID in the DCC registries.</li>
        <li>The signing DID is listed in the proof.verificationMethod property of the Verifiable Credential</li>
      </ul> 
      <div className={styles.preference}>See the example sections for examples of a proof signed by both a did:key and a did:web.</div>
    </div>)
}

const DetailsSection = () => {
  return (
    <ul className={styles.list}>
      <li>Verifies that we recognize the Decentralized Identifier (DID) that signed the credential.</li>
      <li>The DCC makes no claims about the authenticity or relevance of credentials signed by DIDs in its registries - only that we know about the DIDs in some way.</li>   
    </ul>
  )
}

const NotesSection = () => {
  return (
    <>
       <div className={styles.note}><img className={styles.infoIcon} src="./icons/info_24_lime.svg"></img>
      Fundmentally important is that to trust anything signed by an issuer,
      the DID (Decentralized Identififer) used to
      sign the credential must be known to us in some way. That might be because
      we keep a list of DIDs in our verifier that we know about (an internal registry), or it might that we look up
      the DID in some kind of shared registry that we in turn trust. Both are effectively lists
      of DIDs that we trust. If a credential has not been signed by a DID that we know about
      then we cannot trust the credential - it could have been faked and signed by anyone.
      </div>

      <div className={styles.note}><img className={styles.infoIcon} src="./icons/info_24_lime.svg"></img>
      We look up DIDs in a registry controlled by the Digital Credentials Consortium.
        We don't, however, make any guarantees about the trustworthiness or legitimacy of the credentials - only that they
        were signed by a key that has been registered as a DID in one of our registries. We make no guarantees because our registries are 
        strictly for demonstration purposes. 
        </div>

<div className={styles.note}><img className={styles.infoIcon} src="./icons/info_24_lime.svg"></img>
      If we can't find an issuer's DID in one of our registries we only provide a warning, rather than declare the 
      credential completely invalid, because VerifierPlus is educational and we expect that people
      will use our verification for demonstration and testing.<br/><br/>
        A 'real' verifier would use a registry whose registered issuers had been vetted and approved to issue specific credentials. 
       A registry of DIDs controlled by the association of university registrars for a given coountry, for example,
            could be used to verify digital degrees from accredited universities. In this case, it might then be more accurate
            to say it was a registry of 'trusted' issuers, rather than simply 'known' issuers.</div>
          </>
  )
}

const DescriptionSection = () => {
  return (
    <div className={styles.note}>Checks that the credential was signed by an issuer in our registry.</div>
  )
}

export const knownIssuerFormatHelpDescription = DescriptionSection()

export const knownIssuerHelpSections = [
  { sectionTitle: 'Details', content: DetailsSection() },
  { sectionTitle: 'How We Determine Who Issued the Credential', content: DeterminationSection() },
  { sectionTitle: 'Example did:key VC', content: DidKeyVCSection() },
  { sectionTitle: 'Example did:web VC', content: DidWebVCSection() },
  { sectionTitle: 'Notes', content: NotesSection() }
]
