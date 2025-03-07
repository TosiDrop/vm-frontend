import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export enum PaymentStatus {
  Awaiting,
  AwaitingConfirmations,
  Sent,
  Completed,
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
  preview,
  mainnet,
  undefined,
}

export enum ModalTypes {
  info,
}

export enum InfoModalTypes {
  info,
  failure,
  success,
}

export enum Themes {
  light = "theme-light",
  dark = "theme-dark",
}

export enum Blockchain {
  cardano = "cardano",
}

export enum PageRoute {
  claimCardano = "/cardano/claim",
  depositCardano = "/cardano/deposit",
  historyCardano = "/cardano/history",
}

export interface MenuItem {
  text: string;
  to: PageRoute;
  activeRoute: PageRoute[];
  icon: IconDefinition;
}

export interface SocialMediaItem {
  icon: IconDefinition;
  url: string;
  colorClassname: string; // for text color
}

export enum TransactionStatusDetail {
  waiting = 0,
  processing = 1,
  failure = 2,
  success = 3,
}

export interface PopUpInfo {
  title: string;
  text: string;
  buttonLink: string;
  buttonText: string;
}

/**
 * @deprecated {@link DeliveredReward}
 * ParsedReward does not really explain what reward is parsed. Also, let's parse
 * any rewards on server
 */
export interface ParsedReward {
  token: string;
  ticker: string;
  amount: number;
  delivered_on: string;
  decimals: number;
}

export interface DeliveredReward {
  token: string;
  ticker: string;
  amount: number;
  delivered_on: string;
  decimals: number;
}

export enum WalletState {
  notConnected,
  connecting,
  connected,
  wrongNetwork,
}

export interface WalletInfo {
  address: string;
  iconUrl: string;
  isApiConnected: boolean;
  prefix?: string;
}
