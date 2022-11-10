import {StandardNftMetadata, Trait} from "./StandardNftMetadata";

interface DocumentTypeTrait extends Trait {
    // required
    trait_type: "document-type"
    display_type: "string"
    value: 'acknowledgment' | 'jurat' | 'affirmation'
}

interface DateNotarizedTrait extends Trait {
    // required
    trait_type: "date-notarized"
    display_type: "date"
}

interface PrivateNotarizedDataSchema {
    authorizedAddress: string
    role: 'notary' | 'signer' | 'grantee' | 'admin'
    encryptedDocumentWithNotarizationCertificate: string
}

// The admin can retrieve all of the
interface AdminNotarizedDataSchema extends PrivateNotarizedDataSchema {
    role: 'admin'
    encryptedAudioVisualRecording: string
    encryptedNotaryJournalEntry: string
    encryptedOriginalDocument: string
    encryptedNotaryCommissionCertificate: string
    encryptedNotaryBondCertificate: string
    encryptedNotaryInsuranceCertificate: string
}

interface NotaryNotorizedDataSchema extends PrivateNotarizedDataSchema {
    role: 'notary'
    encryptedNotaryJournalEntry: string
}

interface SignerNotorizedDataSchema extends PrivateNotarizedDataSchema {
    role: 'signer'
    encryptedOriginalDocument: string
    encryptedNotaryCommissionCertificate: string
    encryptedNotaryBondCertificate: string
    encryptedNotaryInsuranceCertificate: string
}

interface GranteeNotorizedDataSchema extends PrivateNotarizedDataSchema {
    role: 'grantee'
}

type EncryptedPrivateNotarizedDataList =
    (NotaryNotorizedDataSchema | SignerNotorizedDataSchema | GranteeNotorizedDataSchema)[]

type NotarizedDocumentNftMetadataTrait = DocumentTypeTrait | DateNotarizedTrait
interface NotarizedDocumentNftMetadata extends StandardNftMetadata<NotarizedDocumentNftMetadataTrait> {
    notaryId: string
    orderId: string
    privateData: EncryptedPrivateNotarizedDataList
}