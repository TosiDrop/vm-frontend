export enum PaymentStatus {
    Awaiting,
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
