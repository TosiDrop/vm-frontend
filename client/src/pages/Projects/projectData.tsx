import LogoTosiLight from "src/assets/tosidrop-light.png";
import LogoTosiDark from "src/assets/tosidrop-dark.png";
import LogoTosiCompact from "src/assets/tosidrop_logo.png";


export interface ProjectURLs {
    medium?: string;
    twitter?: string;
    discord?: string;
    telegram?: string;
    website?: string;
    litepaper?: string;
    docs?: string;
    cardanoExplorer?: string;
    poolpm?: string;
}

export interface ProjectData {
    logoDefault: string;
    logoDark?: string;
    logoCompact?: string;

    descShort: string;
    descLong: string;
    claimDesc: string;

    token: string;
    totalSupply: number;
    policyID: string;
    /*marketCap: number;
    fdMarketCap: number;*/

    urls: ProjectURLs;
}

// TODO: Fill with the actual data
export const sampleData: ProjectData[] = [
    { // Aneta
        logoDefault: LogoTosiLight,
        logoDark: LogoTosiDark,
        logoCompact: LogoTosiCompact,
        descShort: "AnetaBTC is a fully on-chain, decentralized protocol that allows Bitcoin to be directly wrapped on the Ergo and Cardano blockchains.",
        descLong: "AnetaBTC is a fully on-chain, decentralized protocol that allows Bitcoin to be directly wrapped on the Ergo and Cardano blockchains. Rooted in the fundamentals of decentralization, anetaBTC is backed by a strong global community, and is developing infrastrucrture throughout both Cardano and Ergo to advance the adoption and functionality of both platforms. anetaBTC is on target to release their wrapping protocol on the Ergo tesnet in Q4 2022. cNETA, the Cardano native token of anetaBTC, represents governance and revenue rights over the anetBTC protocol, including ownership of anetaBTC’s community owned NETA Liquidity Fund, which holds 8+ assets and over $1 million in total value.",
        claimDesc: "Must be staking to one of the follwing pools: NETA1, NETA2, ...",
        token: "cNETA",
        totalSupply: 1000000000,
        policyID: "b34b3ea80060ace9427bda98690a73d33840e27aaa8d6edb7f0c757a",
        urls: {
            website: "http://example.com",
            medium: "http://example.com",
            twitter: "http://example.com",
            discord: "http://example.com",
            telegram: "http://example.com",
            litepaper: "http://example.com",
            docs: "http://example.com",
            cardanoExplorer: "http://example.com",
            poolpm: "http://example.com",
        },
    },
    { // Tosi
        logoDefault: LogoTosiLight,
        logoDark: LogoTosiDark,
        logoCompact: LogoTosiCompact,
        descShort: "TosiDrop is a token distribution platform on Cardano and Ergo that allows projects in the ecosystem to seamlessly distribute tokens to their community members.",
        descLong: "",
        claimDesc: "",
        token: "cTOSI",
        totalSupply: 1000000000,
        policyID: "b34b3ea80060ace9427bda98690a73d33840e27aaa8d6edb7f0c757a",
        urls: {
        website: "http://example.com",
        medium: "http://example.com",
        twitter: "http://example.com",
        discord: "http://example.com",
        telegram: "http://example.com",
        litepaper: "http://example.com",
        docs: "http://example.com",
        cardanoExplorer: "http://example.com",
        poolpm: "http://example.com",
        },
    },
    { // SCAT DAO
        logoDefault: LogoTosiLight,
        logoDark: LogoTosiDark,
        logoCompact: LogoTosiCompact,
        descShort: "SCAT DAO is bringing decentralized audits, research, and safety to Cardano. Token holders can vote on which projects they would like to be audited.",
        descLong: "",
        claimDesc: "",
        token: "AUDIT",
        totalSupply: 1000000000,
        policyID: "b34b3ea80060ace9427bda98690a73d33840e27aaa8d6edb7f0c757a",
        urls: {
        website: "http://example.com",
        medium: "http://example.com",
        twitter: "http://example.com",
        discord: "http://example.com",
        telegram: "http://example.com",
        litepaper: "http://example.com",
        docs: "http://example.com",
        cardanoExplorer: "http://example.com",
        poolpm: "http://example.com",
        },
    },
  ]
