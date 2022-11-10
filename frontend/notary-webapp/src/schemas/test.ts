import {IdNumberTrait, NotaryMetadata} from "./NotaryMetadata";
import {NumberTrait, Trait} from "./StandardNftMetadata";
import {NotarizedDocumentNftMetadata, PrivateNotarizedDataSchema} from "./NotarizedDocumentMetadata";

const trait: Trait = {
    value: "woot",
    trait_type: "myTrait",
    display_type: "string"
}

const id: IdNumberTrait = {
    value: "123ABC",
    trait_type: "idNumber",
    display_type: "string"
}

const test: NotaryMetadata = {
    description: "foo",
    name: "bar",
    image: "ooga",
    external_url: "booga",
    attributes: [id, trait]
}

const privateNotarizedDataInstance: PrivateNotarizedDataSchema = {
    authorizedAddress: 'alice',
    encryptedOriginalDocument: 'ipfs://unnotariedDocument',
    encryptedDocumentWithNotarizationCertificate: 'ipfs://notarizedDocument',
    encryptedAudioVisualRecording: 'ipfs://recording',
    encryptedNotaryJournalEntry: 'ipfs://journalEntry',
    encryptedNotaryCommissionCertificate: 'ipfs://notaryCommissionCertificate',
    encryptedNotaryBondCertificate: 'ipfs://notaryBondCertificate',
    encryptedNotaryInsuranceCertificate: 'ipfs://notaryInsuranceCertificate'
}

const notarized: NotarizedDocumentNftMetadata = {
    description: "1",
    name: '2',
    image: '3',
    external_url: '4',
    notaryId: '5',
    orderId: '6',
    privateData: [privateNotarizedDataInstance],
}