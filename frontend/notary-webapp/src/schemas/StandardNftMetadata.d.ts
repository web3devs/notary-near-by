export interface Trait {
    trait_type: string,
    value: any,
    display_type: "string" | "date" | "number" | "boost_percentage" | "boost_number",
}

export interface NumberTrait extends Trait {
    display_type: "number" | "boost_percentage" | "boost_number",
    max_value?: number
}

export type StandardNftMetadata<T extends Trait> = {
    description: string,
    external_url: string, // link to viewing page for the nft
    image: string, // link to the notary's stamp
    name: string, // Notary's registered name
    attributes?: T[]
}
