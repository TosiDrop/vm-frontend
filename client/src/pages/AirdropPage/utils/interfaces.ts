export interface AdaAddress {
  address: string;
  adaAmount?: number;
}

export interface TokenAddress {
  address: string;
  tokenAmount: number;
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

export interface PopUpProps {
  show: boolean;
  type: PopUpType;
  text: string;
}

export interface AirdropRequestBody {
  source_addresses: string[];
  change_address?: string;
  token_name: string;
  addresses: {
    [key: string]: number;
  }[];
}

/**
 * policy ID => asset name in hex => amount
 */
export interface PolicyIDAndAssetNameToAmountMap {
  [key: PolicyID]: {
    [key: AssetName]: number;
  };
}

/**
 * policy ID => asset name in hex => { address, amount }
 */
export interface PolicyIDAndAssetNameToAdaAddressMap {
  [key: PolicyID]: {
    [key: AssetName]: AdaAddress[];
  };
}

export interface AssetDetailFromAPI {
  decimals: number;
  ticker: string;
  policy_id: string;
  name_hex: string;
}

export interface TransactionInfo {
  description: string;
  type: string;
  cborHex: string;
}

export enum PopUpType {
  LOADING = "loading",
  SUCCESS = "success",
  FAIL = "fail",
}

export enum TransactionState {
  LOADING = "loading",
  UNSIGNED = "unsigned",
  SUCCESSSFUL = "successful",
  UNSUCCESSSFUL = "unsuccessful",
}

export type API = object | undefined;
export type PolicyID = string;
export type AssetName = string;