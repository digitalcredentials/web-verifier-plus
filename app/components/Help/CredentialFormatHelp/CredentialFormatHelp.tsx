import styles from '../Help.module.css';
import { VcDisplay } from '@/components/VcDisplay/VcDisplay';


const SampleVCSection = () => {
  return <VcDisplay link='https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v2/dataIntegrityProof/didKey/legacyRegistry-noStatus-noExpiry-credSubjName.json' nodesToExpand={['credentialSubject', 'credentialSubject.achievement', 'credentialSubject.achievement.criteria']} />
}

const DeterminationSection = () => {
  return (
    <div>
      <div className={styles.preference}>The credential must:</div>
      <ul className={styles.list}>
        <li>be valid JSON</li>
        <li>have a JSON-LD context</li>
      </ul>
       <div className={styles.preference}>See the example section for an example of a well formed Verifiable Credential.</div>
  
    </div>)
}

const DetailsSection = () => {
  return (
    <ul className={styles.list}>
      <li>Various checks to confirm we are dealing with a well-formed Verifiable Credential.</li>
      <li>These aren't checks on the validity of the signature or data, but rather simply that the data is in the format we expect.</li>
    </ul>
  )
}

const NotesSection = () => {
  return (
    <>
      <div className={styles.note}><img className={styles.infoIcon} src="./icons/info_24_lime.svg" />We try to check for as many things as possible, but
      of course there may be edge cases that haven't yet surfaced.
      </div>
          </>
  )
}

const DescriptionSection = () => {
  return (
    <div className={styles.note}>A check that the credential is properly formatted.</div>
  )
}

export const credentialFormatHelpDescription = DescriptionSection()

export const credentialFormatHelpSections = [
  { sectionTitle: 'Details', content: DetailsSection() },
  { sectionTitle: 'How We Determine the Credential is Properly Formatted', content: DeterminationSection() },
  { sectionTitle: 'Example VC', content: SampleVCSection() },
  { sectionTitle: 'Notes', content: NotesSection() }
]



