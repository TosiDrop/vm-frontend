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
}

export interface ProjectData {
  logos: ProjectLogos;
  descs: ProjectDescs;
  token: ProjectTokenInfo;
  urls: ProjectURLs;
}
