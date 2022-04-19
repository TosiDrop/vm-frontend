export enum PaymentStatus {
    Awaiting,
    AwaitingConfirmations,
    Sent,
    Completed
}

export interface ExtendedMetadata {
    itn: Itn;
    info: Info;
    "my-pool-ids": MyPoolIDS;
    "when-satured-then-recommend": MyPoolIDS;
}

export interface Metadata {
    name: string;
    description: string;
    ticker: string;
    homepage: string;
    extended: string;
}

export interface Info {
    url_png_icon_64x64: string;
    url_png_logo: string;
    location: string;
    social: Social;
    about: About;
    rss: string;
}

export interface About {
    me: string;
    server: string;
}

export interface Social {
    twitter_handle: string;
    github_handle: string;
}

export interface Itn {
    owner: string;
    witness: string;
}

export interface MyPoolIDS {
    [key: string]: string;
}

export interface AirdropAddress {
    address: string;
    amount: number;
}

export interface AdaAddress {
    address: string;
    adaAmount?: number;
}

export interface Token {
    name: string;
    amount: number;
    decimals: number;
    ticker: string;
    policyId: string;
    nameHex: string;
    addressContainingToken: AdaAddress[];
}

export interface TokenTransactionHashRequest {
    address: string;
    afterBlock: number;
    tokens: TokenTransactionHashRequestTokens[];
}

export interface TokenTransactionHashRequestTokens {
    policyId: string;
    quantity: string;
}

export interface PaymentTransactionHashRequest {
    address: string;
    toAddress: string;
    afterBlock: number;
    adaToSend: number;
}

export enum NetworkId {
    testnet,
    mainnet,
    undefined
<<<<<<< HEAD
}
=======
}
>>>>>>> 5ac342c (wallet connected checks the correct network / several fixes regarding this)
