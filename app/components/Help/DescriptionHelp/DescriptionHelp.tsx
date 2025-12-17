import styles from '../Help.module.css';
import { VcDisplay } from '@/components/VcDisplay/VcDisplay';




const SampleVCSection = () => {
  return <VcDisplay link='https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v2/dataIntegrityProof/didKey/legacyRegistry-noStatus-noExpiry-credSubjName.json' nodesToExpand={['credentialSubject', 'credentialSubject.achievement']}/>
}



const DeterminationSection = () => {
  return (
    <div>
           <div className={styles.preference}>In order of preference:</div>
      <ul className={styles.list}>
      <li>credential.credentialSubject.achievement.description (OBv3)</li>
      <li>credential.credentialSubject.hasCredential.description</li>
    </ul>
      <div className={styles.preference}>See the example section for an example of the OBv3 encoding. The other encoding is a legacy encoding that will likely be deprecated.</div>
    </div>)
}

const DetailsSection = () => {
  return (
    <ul className={styles.list}>
      <li>A short human readable description of the credential<br/>e.g, 'Bachelor of Science in Computer Science'.</li>
      <li>Required by the OpenBadges version 3 data model.</li>
      <li>Not required by the Verifiable Credential data model.</li>
      <li>If no description is provided, nothing is shown, including the 'Description' title.</li>
    </ul>
  )
}

const NotesSection = () => {
  return (
    <>  
    <div className={styles.note}><img className={styles.infoIcon} src="./icons/info_24_lime.svg"/>Although we do support 'credentialSubject.hasCredential.description', 
    that is an older encoding that we only support for backwards compatability and anyone authoring new credentials should likely
    not use that encoding. Support will likely be removed in the near future.
    
    </div>
    <div className={styles.note}><img className={styles.infoIcon} src="./icons/info_24_lime.svg"/>Note that formatting is not accommodated in the 
    description field. To provide a more stylized presentation, consider using the 'Criteria' field, which does allow 
    Markdown syntax.
    </div>
    </>
  )
}

const DescriptionSection = () => {
  return (
    <div className={styles.note}>A short human readable description of the credential.</div>
  )
}

export const descriptionHelpDescription = DescriptionSection()

export const descriptionHelpSections  = [
  { sectionTitle: 'Details', content: DetailsSection() },
  { sectionTitle: 'How We Determine the Subject', content: DeterminationSection() },
  { sectionTitle: 'Example VC - credential description', content: SampleVCSection() },
  { sectionTitle: 'Notes', content: NotesSection( )}
]



