import styles from '../Help.module.css';
import { VcDisplay } from '@/components/VcDisplay/VcDisplay';

const ExampleV2Section = () => {
  return <VcDisplay link='https://digitalcredentials.github.io/vc-test-fixtures/verifiableCredentials/v2/ed25519/didKey/legacy-noStatus-expired.json' nodesToExpand={['validUntil']}/>
}


const DeterminationSection = () => {
  return (
    <div>
       <div className={styles.preference}>In order of preference:</div>
      <ul className={styles.list}>
      <li>credential.credentialSubject.name</li>
      <li>credential.credentialSubject.identifiers[identityType=name].identityHash</li>
      <li>credential.name</li>
    </ul>
      <div className={styles.preference}>See the example section for examples of each.</div>
    </div>)
}

const DetailsSection = () => {
  return (
    <ul className={styles.list}>
      <li>Typically, this is the <b>subject</b> of the credential, e.g., a student who earned a diploma.</li>
      <li>Sometimes called the 'subject', 'earner', 'recipient', or the 'holder'.</li>
      <li>Set directly in the Verifiable Credential and cannot be changed without invalidating the cryptographic signature.</li>
    </ul>
  )
}

const NotesSection = () => {
  return (
    <>  
        <div className={styles.note}><img className={styles.infoIcon} src="./icons/info_24_lime.svg"/>Some Verifiable Credentials are issued to 
    an <b>identifier</b> rather than the name of a person. In particular, they can be issued to a Decentralized Identifier (DID)
    belonging to the holder of the credential. The holder can later use this DID to sign a cryptographic challenge, thereby proving that they
    <b>control</b> the credential.
    </div>
<div className={styles.note}><img className={styles.infoIcon} src="./icons/info_24_lime.svg"/>
  A credential might be 'issued to' someone other than the 'subject' of the credential, ans so we might instead say the 
    credential was issued to a 'holder'. An example could be a birth certificate for a child (the subject), but issued to the parent (the holder)
    who can then act on the child's behalf. However, Verifiable Credentials are a relatively new technology, there
    isn't yet clear consensus on terminology, and the same term can often be used to describe different things, so it is 
    important to interpet context. The subject of the credential, however, will always be whomever the underlying credential applies to.
    </div>

    <div className={styles.note}><img className={styles.infoIcon} src="./icons/info_24_lime.svg"/>Some Verifiable Credentials might not 
    explicitly define a subject. Such credentials are sometimes called 'bearer credentials' meaning they belong to 
    whoever holds the credential. As such, when determining what to show for the 'issued to' field we try our best (as described below) 
    to determine the name of the credential subject, but default in the end to credential.name if no other value is found.
    </div>
    </>
  )
}

const DescriptionSection = () => {
  return (
    <div className={styles.note}>The <span className={styles.italics}>subject</span> of the credential.</div>
  )
}

export const holderHelpDescription = DescriptionSection()

export const holderHelpSections  = [
  { sectionTitle: 'Details', content: DetailsSection() },
  { sectionTitle: 'How We Determine the Subject', content: DeterminationSection() },
  { sectionTitle: 'Example Verifiable Credential', content: ExampleV2Section() },
  { sectionTitle: 'Notes', content: NotesSection( )}
]


