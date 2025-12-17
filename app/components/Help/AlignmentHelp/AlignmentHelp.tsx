import styles from '../Help.module.css';
import { VcDisplay } from '@/components/VcDisplay/VcDisplay';

const SampleVCSection = () => {
  return <VcDisplay link='https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v2/dataIntegrityProof/didKey/legacyRegistry-noStatus-noExpiry-alignments.json' nodesToExpand={['credentialSubject', 'credentialSubject.achievement', 'credentialSubject.achievement.alignment']}/>
}

const DeterminationSection = () => {
  return (
    <div>
         <div className={styles.preference}>If present:</div>
          <ul className={styles.list}>
      <li>credential.credentialSubject.achievement.alignment</li>
    </ul>
      <div className={styles.preference}>See the example section for an example</div>
    </div>)
}

const DetailsSection = () => {
  return (
    <ul className={styles.list}>
       <li>A list of alignments with published credential definitions.</li>
       <li>Can be thought of as a list of equivalencies with other types of credential.</li>
      <li>Defined by the OpenBadges version 3 data model, but not required.</li>
      <li>Not required by Verifiable Credential data model.</li>
      <li>If no alignments are provided, nothing is shown, including the 'Alignments' title.</li>
    </ul>
  )
}

const NotesSection = () => {
  return (
    <>  
    <div className={styles.note}><img className={styles.infoIcon} src="./icons/info_24_lime.svg"/>The alignment entries
    can be intended for both human and machine consumption. The 'targetCode' and 'targetUrl' provide machine readable references, and
    the 'targetName' and 'targetDescription' provide human readable descriptions.
    </div>  </>
  )
}

const DescriptionSection = () => {
  return (
    <div className={styles.note}>How the credential aligns with published credential definitions.</div>
  )
}

export const alignmentHelpDescription = DescriptionSection()

export const alignmentHelpSections  = [
  { sectionTitle: 'Details', content: DetailsSection() },
  { sectionTitle: 'How We Determine Alignments', content: DeterminationSection() },
  { sectionTitle: 'Example VC - alignments', content: SampleVCSection() },
  { sectionTitle: 'Notes', content: NotesSection( )}
]



