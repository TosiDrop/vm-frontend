/**
 * @deprecated in favor of {@link ProjectsDto.Urls}
 */
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

/**
 * @deprecated in favor of {@link ProjectsDto.Logo}
 */
export interface ProjectLogos {
  logoDefault: string;
  logoDark?: string;
  logoCompact?: string;
  logoCompactDark?: string;
}

/**
 * @deprecated in favor of {@link ProjectsDto.Desc}
 */
export interface ProjectDescs {
  descShort: string;
  descLong?: string;
  claimDesc?: string;
}

/**
 * @deprecated in favor of {@link ProjectsDto.TokenInfo}
 */
export interface ProjectTokenInfo {
  token: string;
  totalSupply?: number;
  policyID: string;
}

/**
 * @deprecated in favor of {@link ProjectsDto.Data}
 */
export interface ProjectData {
  logos: ProjectLogos;
  descs: ProjectDescs;
  token: ProjectTokenInfo;
  urls: ProjectURLs;
}
