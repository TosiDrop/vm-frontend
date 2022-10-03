import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faDiscord,
  faTelegram,
  faMedium,
} from "@fortawesome/free-brands-svg-icons";
import { Themes } from "src/entities/common.entities";

import LogoAneta from "src/assets/projectLogos/aneta-full-light.png";
import LogoAnetaDark from "src/assets/projectLogos/aneta-full-dark.png";
import LogoAnetaCompact from "src/assets/projectLogos/aneta-compact-light.png";

import LogoMinswap from "src/assets/projectLogos/minswap-full-light.png";
import LogoMinswapDark from "src/assets/projectLogos/minswap-full-dark.png";
import LogoMinswapCompact from "src/assets/projectLogos/minswap-compact-light.png";
import LogoMinswapCompactDark from "src/assets/projectLogos/minswap-compact-dark.png";

import LogoArdana from "src/assets/projectLogos/ardana-full-dark.png";
import LogoArdanaCompact from "src/assets/projectLogos/ardana-compact-dark.png";

export class ProjectURLs {
  constructor(
    public website?: string,
    public medium?: string,
    public twitter?: string,
    public discord?: string,
    public telegram?: string,
    public whitepaper?: string,
    public docs?: string,
    public github?: string,
    public cardanoScan?: string,
    public poolpm?: string,
  ) { }

  render(): JSX.Element[] {
    var elements: JSX.Element[] = [];
    if (this.medium) {
      elements.push(
        <a href={this.medium} className="text-medium m-1">
          <FontAwesomeIcon icon={faMedium} />
        </a>
      );
    }
    if (this.twitter) {
      elements.push(
        <a href={this.twitter} className="text-twitter m-1">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      );
    }
    if (this.discord) {
      elements.push(
        <a href={this.discord} className="text-discord m-1">
          <FontAwesomeIcon icon={faDiscord} />
        </a>
      );
    }
    if (this.telegram) {
      elements.push(
        <a href={this.telegram} className="text-telegram m-1">
          <FontAwesomeIcon icon={faTelegram} />
        </a>
      );
    }
    /*if (urls.cardanoScan) {
      elements.push(<a href={urls.cardanoScan}><img src=""/></a>);
    }
    if (urls.poolpm) {
      elements.push(<a href={urls.poolpm}><img src=""/></a>);
    }*/
    return elements;
  }
}

export class ProjectLogos {
  constructor(
    public logoDefault: string,
    public logoDark?: string,
    public logoCompact?: string,
    public logoCompactDark?: string,
  ) { }

  render(theme: Themes): JSX.Element {
    let logo = this.logoDefault;
    let compactLogo = this.logoCompact ?? this.logoDefault;
    if (theme === Themes.dark) {
      if (this.logoDark) logo = this.logoDark;
      if (this.logoCompactDark) compactLogo = this.logoCompactDark;
    }
    return (
      <div>
        <img src={logo} className="logo hidden sm:block"></img>
        <img src={compactLogo} className="logo sm:hidden"></img>
      </div>
    );
  }
}

export class ProjectDescs {
  constructor(
    public descShort: string,
    public descLong?: string,
    public claimDesc?: string,
  ) { }
}

export class ProjectTokenInfo {
  constructor(
    public token: string,
    public totalSupply: number,
    public policyID: string,
    //public marketCap: number; //Need to pull this info dynamically, will likely be a method instead of an member
    //public fdMarketCap: number; //Need to pull this info dynamically, will likely be a method instead of an member
  ) { }
}

export class ProjectData {
  constructor(
    public logos: ProjectLogos,
    public descs: ProjectDescs,
    public token: ProjectTokenInfo,
    public urls: ProjectURLs,
  ) { }

  render(theme: Themes): JSX.Element {
    return (
      <div className="rounded-2xl background px-2.5 py-2.5 mt-5 mb-5 items-center text-base text-left flex flex-wrap md:flex-row">
      <div className="basis-7/12 flex flex-row grow items-center">
        <div className="m-2.5 p-2.5 basis-3/12">
          {this.logos.render(theme)}
        </div>
        <div className="m-2.5 p-2.5 basis-9/12 grow md:border-r">
          {this.descs.descShort}
        </div>
      </div>

      <div className="basis-5/12 flex flex-row grow items-center">
        <div className="m-2.5 p-2.5 basis-1/4 ">
          <div>Token:</div>
          <div className="font-bold">{this.token.token}</div>
        </div>
        <div className="m-2.5 p-2.5 basis-1/4 ">
          <div>Total Supply:</div>
          <div className="font-bold text-sm">
            {this.token.totalSupply.toLocaleString("en-US")}
          </div>
        </div>
        <div className="m-2.5 p-2.5 basis-2/4 text-2xl">
          {this.urls.render()}
        </div>
      </div>
    </div>
    )
  }

}

export const sampleData: ProjectData[] = [

  new ProjectData(      
    new ProjectLogos(LogoAneta,LogoAnetaDark,LogoAnetaCompact,undefined),
    new ProjectDescs(
        "AnetaBTC is a fully on-chain, decentralized protocol that allows Bitcoin to be directly wrapped on the Ergo and Cardano blockchains.",
        "AnetaBTC is a fully on-chain, decentralized protocol that allows Bitcoin to be directly wrapped on the Ergo and Cardano blockchains. Rooted in the fundamentals of decentralization, anetaBTC is backed by a strong global community, and is developing infrastrucrture throughout both Cardano and Ergo to advance the adoption and functionality of both platforms. anetaBTC is on target to release their wrapping protocol on the Ergo tesnet in Q4 2022. cNETA, the Cardano native token of anetaBTC, represents governance and revenue rights over the anetBTC protocol, including ownership of anetaBTC’s community owned NETA Liquidity Fund, which holds 8+ assets and over $1 million in total value.",
        "Must be staking to one of the follwing pools: NETA1, NETA2, ..."
    ),      
    new ProjectTokenInfo(
      "cNETA",
      1000000000,
      "b34b3ea80060ace9427bda98690a73d33840e27aaa8d6edb7f0c757a"
    ),
    new ProjectURLs(
      "https://anetabtc.io/", // website
      "https://medium.com/@anetaBTC", // medium
      "https://twitter.com/anetaBTC", // twitter
      "https://discord.com/invite/ScXG76dJXM", // discord
      "https://t.me/anetaBTC", // telegram
      "https://medium.com/@anetaBTC/anetabtc-litepaper-v1-0-171f29b3276a", // paper
      undefined, // docs
      undefined, // github
      "https://cardanoscan.io/token/b34b3ea80060ace9427bda98690a73d33840e27aaa8d6edb7f0c757a634e455441", // cardanoeScan
      undefined, // poolpm
    )
  ),

  new ProjectData(      
    new ProjectLogos(LogoMinswap, LogoMinswapDark, LogoMinswapCompact, LogoMinswapCompactDark),
    new ProjectDescs(
      "Minswap is a Decentralized Exchange (DEX)",
      undefined,
      undefined
    ),      
    new ProjectTokenInfo(
      "MIN",
      5000000000,
      "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6"
    ),
    new ProjectURLs(
      "https://minswap.org/", // website
      "https://medium.com/minswap", // medium
      "https://twitter.com/minswapdex", // twitter
      "https://discord.gg/ZjB8ZBhkbm", // discord
      "https://t.me/MinswapMafia", // telegram
      "https://docs.minswap.org/whitepaper", // paper
      "https://docs.minswap.org/", // docs
      undefined, // github
      "https://cardanoscan.io/token/29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c64d494e", // cardanoScan
      undefined, // poolpm
    )
  ),

  new ProjectData(      
    new ProjectLogos(LogoArdana,undefined,LogoArdanaCompact,undefined),
    new ProjectDescs(
      "Ardana is a decentralized stablecoin hub which will bring the necessary DeFi primitives needed to bootstrap & maintain any economy to Cardano.",
      undefined,
      undefined
    ),      
    new ProjectTokenInfo(
      "DANA",
      125000000,
      "c88bbd1848db5ea665b1fffbefba86e8dcd723b5085348e8a8d2260f"
    ),
    new ProjectURLs(
      "https://ardana.org/", // website
      "https://medium.com/ardana-hub", // medium
      "https://twitter.com/ardanaproject", // twitter
      "https://discord.gg/deJvmdTamu", // discord
      "https://t.me/ardanaofficial", // telegram
      "", // paper
      "https://docs.ardana.org/", // docs
      undefined, // github
      "https://cardanoscan.io/token/c88bbd1848db5ea665b1fffbefba86e8dcd723b5085348e8a8d2260f44414e41", // cardanoScan
      undefined, // poolpm
    )
  ),

];
