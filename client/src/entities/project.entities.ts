import LogoAneta from "src/assets/projectLogos/aneta-full-light.png";
import LogoAnetaDark from "src/assets/projectLogos/aneta-full-dark.png";
import LogoAnetaCompact from "src/assets/projectLogos/aneta-compact-light.png";

import LogoMinswap from "src/assets/projectLogos/minswap-full-light.png";
import LogoMinswapDark from "src/assets/projectLogos/minswap-full-dark.png";
import LogoMinswapCompact from "src/assets/projectLogos/minswap-compact-light.png";
import LogoMinswapCompactDark from "src/assets/projectLogos/minswap-compact-dark.png";

import LogoArdana from "src/assets/projectLogos/ardana-full-light.png";
import LogoArdanaDark from "src/assets/projectLogos/ardana-full-dark.png";
import LogoArdanaCompact from "src/assets/projectLogos/ardana-compact-dark.png";

import LogoAADA from "src/assets/projectLogos/aada-full-light.png";
import LogoAADADark from "src/assets/projectLogos/aada-full-dark.png";
import LogoAADACompact from "src/assets/projectLogos/aada-compact-light.png";
import LogoAADACompactDark from "src/assets/projectLogos/aada-compact-dark.png";

import LogoSCAT from "src/assets/projectLogos/scatdao-full-light.png";
import LogoSCATDark from "src/assets/projectLogos/scatdao-full-dark.png";
import LogoSCATCompact from "src/assets/projectLogos/scatdao-compact-light.png";
import LogoSCATCompactDark from "src/assets/projectLogos/scatdao-compact-dark.png";

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
  totalSupply?: number;
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
        "AnetaBTC is a fully on-chain, decentralized protocol that allows Bitcoin to be directly wrapped on the Ergo and Cardano blockchains. Rooted in the fundamentals of decentralization, anetaBTC is backed by a strong global community, and is developing infrastructure throughout both Cardano and Ergo to advance the adoption and functionality of both platforms. AnetaBTC is on target to release their wrapping protocol on the Ergo tesnet in Q4 2022. cNETA, the Cardano native token of anetaBTC, represents governance and revenue rights over the anetBTC protocol, including ownership of anetaBTC’s community owned NETA Liquidity Fund, which holds 8+ assets and over $1 million in total value.",
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
      discord: "https://discord.gg/S85CKeyHTc",
      telegram: "https://t.me/anetaBTC",
      paper:
        "https://medium.com/@anetaBTC/anetabtc-litepaper-v1-0-171f29b3276a",
      docs: "https://docs.anetabtc.io/",
      cardanoScan:
        "https://cardanoscan.io/token/b34b3ea80060ace9427bda98690a73d33840e27aaa8d6edb7f0c757a634e455441",
      poolpm: "https://pool.pm/asset1wnxwy544zu8fgyed5vkp2sf3t4t9aptfkc2z5x",
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
      descShort:
        "Minswap is a Decentralized Exchange (DEX). The purpose of a DEX is to enable permissionless trading of token pairs.",
      descLong:
        "Minswap is a Decentralized Exchange (DEX). The purpose of a DEX is to enable permissionless trading of token pairs. For each swap, a fee is taken, which goes to the Liquidity Providers (LPs). Anyone can provide Liquidity as well, hence profits are decentralized. Minswap is a community-centric DEX, in that our tokens are fairly distributed, without any private or VC investment.\n\n" +
        "Minswap has pioneered several ideas in the Cardano ecosystem such as the FISO model, touted as the fairest ISO model in the Cardano community, and they plan to continue developing several value adding features.This will benefit both the Minswap community, and the Cardano community as a whole.",
    },
    token: {
      token: "MIN",
      totalSupply: 5000000000,
      policyID: "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6",
    },
    urls: {
      website: "https://minswap.org/",
      medium: "https://minswap-labs.medium.com/",
      twitter: "https://twitter.com/minswapdex",
      discord: "http://discord.gg/minswap",
      telegram: "https://t.me/MinswapMafia",
      paper: "https://docs.minswap.org/whitepaper",
      docs: "https://docs.minswap.org/",
      cardanoScan:
        "https://cardanoscan.io/token/29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c64d494e",
      poolpm: "https://pool.pm/asset1d9v7aptfvpx7we2la8f25kwprkj2ma5rp6uwzv",
    },
  },

  {
    // Ardana
    logos: {
      logoDefault: LogoArdana,
      logoDark: LogoArdanaDark,
      logoCompact: LogoArdanaCompact,
    },
    descs: {
      descShort:
        "Ardana is a DeFi hub offering DeFi primitives such as a stablecoin platform and a decentralized exchange called Danaswap.",
      descLong:
        "Ardana is a DeFi hub built on the Cardano blockchain. Ardana provides Cardano's users with tried and tested DeFi primitives that will catalyze and sustain its financial ecosystem. The first is a decentralized stablecoin platform which enables users to leverage supported Cardano native assets by generating stablecoins against them; the second is Danaswap, which enables high-efficiency swaps between stable asset-sets, and provides a venue for liquidity providers to earn trading fees & DANA rewards for their liquidity provisioning.",
    },
    token: {
      token: "DANA",
      totalSupply: 125000000,
      policyID: "c88bbd1848db5ea665b1fffbefba86e8dcd723b5085348e8a8d2260f",
    },
    urls: {
      website: "https://ardana.org/",
      medium: "https://medium.com/@ardanaproject",
      twitter: "https://twitter.com/ardanaproject",
      discord: "https://discord.gg/c9skrZvsqH",
      telegram: "https://t.me/ardanaofficial",
      docs: "https://docs.ardana.org/",
      cardanoScan:
        "https://cardanoscan.io/token/c88bbd1848db5ea665b1fffbefba86e8dcd723b5085348e8a8d2260f44414e41",
      poolpm: "https://pool.pm/asset1cwf8cjzvmsjydlsawx3lgujmrwdl2uz8exclkl",
    },
  },

  {
    // AADA
    logos: {
      logoDefault: LogoAADA,
      logoDark: LogoAADADark,
      logoCompact: LogoAADACompact,
      logoCompactDark: LogoAADACompactDark,
    },
    descs: {
      descShort:
        "Aada V.1 app is a peer-to-peer lending and borrowing protocol on the Cardano blockchain.",
      descLong:
        "Aada V.1 app is a peer-to-peer lending and borrowing protocol on the Cardano blockchain. It allows users to submit loan requests and lend assets in an order book style. Borrowers can place inquiries by setting custom parameters like asset type, amount, collateral, term, and interest. In turn, lenders can choose whether to fill orders and liquidate them. The initial Aada protocol is a prequel to the V.2 version, which will include a pooled lending mechanism.",
    },
    token: {
      token: "AADA",
      totalSupply: 29500000,
      policyID: "8fef2d34078659493ce161a6c7fba4b56afefa8535296a5743f69587",
    },
    urls: {
      website: "https://aada.finance/",
      paper:
        "https://github.com/aadafinance/materials/blob/main/Aada_finance_lightpaper.pdf",
      docs: "https://aada.gitbook.io/aada",
      medium: "https://medium.com/@aada.finance",
      twitter: "https://twitter.com/AadaFinance",
      discord: "https://discord.gg/zZPHeH78BE",
      telegram: "https://t.me/aadacommunity",
      cardanoScan:
        "https://cardanoscan.io/token/8fef2d34078659493ce161a6c7fba4b56afefa8535296a5743f6958741414441",
      poolpm: "https://pool.pm/asset1khk46tdfsknze9k84ae0ee0k2x8mcwhz93k70d",
    },
  },

  {
    // SCAT DAO
    logos: {
      logoDefault: LogoSCAT,
      logoDark: LogoSCATDark,
      logoCompact: LogoSCATCompact,
      logoCompactDark: LogoSCATCompactDark,
    },
    descs: {
      descShort:
        "SCAT DAO is bringing decentralized audits, research, and safety to Cardano. Token holders can vote on which projects they would like to be audited.",
      descLong:
        "Smart Contract Audit Token Decentralized Autonomous Organization (SCATDAO) is a new audit paradigm that reinvents the way audits are selected, performed, and financed. With SCATDAO we solve audits inherent problem, the conflict of interest that comes from paying for an audit service. As we have seen with Enron, Tyco, and countless others, the possibility always exists for an auditor to commit fraud to keep their client happy. With SCATDAO, the token holders choose the projects they care for and want to be audited.",
    },
    token: {
      token: "SCAT",
      totalSupply: 1000000000,
      policyID: "f2fe9aafd2e5b3b00e2949a96d44a84d9f4d818d63945010a466a4ae",
    },
    urls: {
      website: "https://www.scatdao.com/",
      paper:
        "https://scatdao.b-cdn.net/wp-content/uploads/2022/06/SCATDAO-Whitepaper.pdf",
      medium: "https://medium.com/@scatdao",
      twitter: "https://twitter.com/SCATDAO",
      discord: "http://discord.gg/rfFkJxu9kP",
      telegram: "http://t.me/SCAT_DAO",
      cardanoScan:
        "https://cardanoscan.io/token/8fef2d34078659493ce161a6c7fba4b56afefa8535296a5743f6958741414441",
      poolpm: "https://pool.pm/asset1khk46tdfsknze9k84ae0ee0k2x8mcwhz93k70d",
    },
  },
];
