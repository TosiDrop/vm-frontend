import LogoAneta from "src/assets/projectLogos/aneta-full-light.png";
import LogoAnetaDark from "src/assets/projectLogos/aneta-full-dark.png";
import LogoAnetaCompact from "src/assets/projectLogos/aneta-compact-light.png";

import LogoMinswap from "src/assets/projectLogos/minswap-full-light.png";
import LogoMinswapDark from "src/assets/projectLogos/minswap-full-dark.png";
import LogoMinswapCompact from "src/assets/projectLogos/minswap-compact-light.png";
import LogoMinswapCompactDark from "src/assets/projectLogos/minswap-compact-dark.png";

import LogoArdana from "src/assets/projectLogos/ardana-full-dark.png";
import LogoArdanaCompact from "src/assets/projectLogos/ardana-compact-dark.png";

export interface ProjectURLs {
  website?: string;
  medium?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  paper?: string;
  docs?: string;
  github?: string;
  cardanoScan?: string;
  poolpm?: string;
}

export interface ProjectLogos {
  logoDefault: string;
  logoDark?: string;
  logoCompact?: string;
  logoCompactDark?: string;
}

export interface ProjectDescs {
  descShort: string;
  descLong?: string;
  claimDesc?: string;
}

export interface ProjectTokenInfo {
  token: string;
  totalSupply: number;
  policyID: string;
  //marketCap: number; //Need to pull this info dynamically, will likely be a method instead of an member
  //fdMarketCap: number; //Need to pull this info dynamically, will likely be a method instead of an member
}

export interface ProjectData {
  logos: ProjectLogos;
  descs: ProjectDescs;
  token: ProjectTokenInfo;
  urls: ProjectURLs;
}

export const sampleData: ProjectData[] = [
  {
    // Aneta
    logos: {
      logoDefault: LogoAneta,
      logoDark: LogoAnetaDark,
      logoCompact: LogoAnetaCompact,
    },
    descs: {
      descShort:
        "AnetaBTC is a fully on-chain, decentralized protocol that allows Bitcoin to be directly wrapped on the Ergo and Cardano blockchains.",
      descLong:
        "AnetaBTC is a fully on-chain, decentralized protocol that allows Bitcoin to be directly wrapped on the Ergo and Cardano blockchains. Rooted in the fundamentals of decentralization, anetaBTC is backed by a strong global community, and is developing infrastrucrture throughout both Cardano and Ergo to advance the adoption and functionality of both platforms. anetaBTC is on target to release their wrapping protocol on the Ergo tesnet in Q4 2022. cNETA, the Cardano native token of anetaBTC, represents governance and revenue rights over the anetBTC protocol, including ownership of anetaBTC’s community owned NETA Liquidity Fund, which holds 8+ assets and over $1 million in total value.",
      claimDesc:
        "Must be staking to one of the follwing pools: NETA1, NETA2, ...",
    },
    token: {
      token: "cNETA",
      totalSupply: 1000000000,
      policyID: "b34b3ea80060ace9427bda98690a73d33840e27aaa8d6edb7f0c757a",
    },
    urls: {
      website: "https://anetabtc.io/",
      medium: "https://medium.com/@anetaBTC",
      twitter: "https://twitter.com/anetaBTC",
      discord: "https://discord.com/invite/ScXG76dJXM",
      telegram: "https://t.me/anetaBTC",
      paper:
        "https://medium.com/@anetaBTC/anetabtc-litepaper-v1-0-171f29b3276a",
      cardanoScan:
        "https://cardanoscan.io/token/b34b3ea80060ace9427bda98690a73d33840e27aaa8d6edb7f0c757a634e455441",
    },
  },

  {
    // Minswap
    logos: {
      logoDefault: LogoMinswap,
      logoDark: LogoMinswapDark,
      logoCompact: LogoMinswapCompact,
      logoCompactDark: LogoMinswapCompactDark,
    },
    descs: {
      descShort: "Minswap is a Decentralized Exchange (DEX)",
    },
    token: {
      token: "MIN",
      totalSupply: 5000000000,
      policyID: "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6",
    },
    urls: {
      website: "https://minswap.org/",
      medium: "https://medium.com/minswap",
      twitter: "https://twitter.com/minswapdex",
      discord: "https://discord.gg/ZjB8ZBhkbm",
      telegram: "https://t.me/MinswapMafia",
      paper: "https://docs.minswap.org/whitepaper",
      docs: "https://docs.minswap.org/",
      cardanoScan:
        "https://cardanoscan.io/token/29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c64d494e",
    },
  },

  {
    logos: {
      logoDefault: LogoArdana,
      logoCompact: LogoArdanaCompact,
    },
    descs: {
      descShort:
        "Ardana is a decentralized stablecoin hub which will bring the necessary DeFi primitives needed to bootstrap & maintain any economy to Cardano.",
    },
    token: {
      token: "DANA",
      totalSupply: 125000000,
      policyID: "c88bbd1848db5ea665b1fffbefba86e8dcd723b5085348e8a8d2260f",
    },
    urls: {
      website: "https://ardana.org/",
      medium: "https://medium.com/ardana-hub",
      twitter: "https://twitter.com/ardanaproject",
      discord: "https://discord.gg/deJvmdTamu",
      telegram: "https://t.me/ardanaofficial",
      docs: "https://docs.ardana.org/",
      cardanoScan:
        "https://cardanoscan.io/token/c88bbd1848db5ea665b1fffbefba86e8dcd723b5085348e8a8d2260f44414e41",
    },
  },
];
