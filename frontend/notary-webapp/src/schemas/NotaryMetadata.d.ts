import {StandardNftMetadata, Trait} from "./StandardNftMetadata";

interface NotaryCompanyTrait extends Trait {
    // optional
    trait_type: "company",
    display_type: "string",
    value: string
}

interface CommissionAuthorityTrait extends Trait {
    // required
    trait_type: "commissionAuthority",
    display_type: "string",
    value: "WA" | "FL" | "VA" | "CO", // the state where the notary is commissioned
}

interface IdNumberTrait extends Trait {
    // required
    trait_type: "idNumber",
    display_type: "string",
    value: string // the state assigned identifier
}

interface CommissionExpirationDateTrait extends Trait {
    // required
    "trait_type": "commissionExpirationDate",
    display_type: "date",
    value: Date
}

interface LicenseImageUriTrait extends Trait {
    // optional
    trait_type: "licenseImageUri",
    display_type: "string",
    value: string // Link to a an image of the notary's license
}

interface StampImageUriTrait extends Trait {
    // required
    trait_type: "StampImageUri",
    display_type: "string",
    value: string // Link to a an image of the notary's stamp
}



type NotaryMetadataTraits = NotaryCompanyTrait | CommissionAuthorityTrait | IdNumberTrait |
    CommissionExpirationDateTrait | LicenseImageUriTrait | StampImageUriTrait
interface NotaryMetadata extends StandardNftMetadata<NotaryMetadataTraits> {
    description: string
    // Example description
    // NotaryNearBy has examined the credentials of ${name} and verified that they were commissioned as a notary public by
    // the state of ${state} on ${commission_date}, and that they their commission is in good standing as of
    // ${date_token_issued}. Their commission expires on ${}.
    attributes: NotaryMetadataTraits[]
}

