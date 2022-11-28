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
