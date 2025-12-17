import styles from '../Help.module.css';
import { VcDisplay } from '@/components/VcDisplay/VcDisplay';




const SampleVCSection = () => {
  return <VcDisplay link='https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v2/dataIntegrityProof/didKey/legacyRegistry-noStatus-noExpiry-credSubjName.json' nodesToExpand={['credentialSubject', 'credentialSubject.achievement', 'credentialSubject.achievement.criteria']}/>
}

const DeterminationSection = () => {
  return (
    <div>
         <div className={styles.preference}>In order of preference:</div>
          <ul className={styles.list}>
      <li>credential.credentialSubject.achievement.criteria.narrative (OBv3)</li>
      <li>credential.credentialSubject.hasCredential.competencyRequired</li>
    </ul>
      <div className={styles.preference}>See the example section for an example of the OBv3 encoding. The hasCredential.competencyRequired encoding is a legacy encoding and should no longer be used. </div>
    </div>)
}

const DetailsSection = () => {
  return (
    <ul className={styles.list}>
       <li>A human readable description of the criteria that must be satisfied to earn the credential.</li>
             <li>Required by the OpenBadges version 3 data model.</li>
      <li>Not required by Verifiable Credential data model.</li>
      <li>If no criteria are provided, nothing is shown, including the 'Criteria' title.</li>
    </ul>
  )
}

const NotesSection = () => {
  return (
    <>  
    <div className={styles.note}><img className={styles.infoIcon} src="./icons/info_24_lime.svg"/>The criteria field supports 
    Markdown syntax.
    </div>
    <div className={styles.note}><img className={styles.infoIcon} src="./icons/info_24_lime.svg"/> The hasCredential.competencyRequired encoding is a legacy encoding and should no longer be used. </div>
    </>
  )
}

const DescriptionSection = () => {
  return (
    <div className={styles.note}>A human readable description of the criteria that must be satisfied to earn the credential.</div>
  )
}

export const criteriaHelpDescription = DescriptionSection()

export const criteriaHelpSections  = [
  { sectionTitle: 'Details', content: DetailsSection() },
  { sectionTitle: 'How We Determine the Criteria', content: DeterminationSection() },
  { sectionTitle: 'Example VC - credential criteria', content: SampleVCSection() },
  { sectionTitle: 'Notes', content: NotesSection( )}
]



