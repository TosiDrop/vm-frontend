import Loader from "./loader";
import { Buffer } from "buffer";
import { Address } from "@emurgo/cardano-serialization-lib-asmjs";
import { NetworkId } from "src/entities/common.entities";
import { getEpochParams } from "src/services/common";

declare global {
  interface Window {
    cardano: CIP0030Wallets;
  }
}

if (typeof window !== "undefined") {
  window.cardano = window.cardano as CIP0030Wallets;
}

export async function Cardano() {
  await Loader.load();
  return Loader.Cardano;
}

export enum WalletKeys {
  anetawallet = "anetawallet",
  cardwallet = "cardwallet",
  eternl = "eternl",
  flint = "flint",
  gerowallet = "gerowallet",
  nami = "nami",
  nufi = "nufi",
  typhoncip30 = "typhoncip30",
}

const ERROR = {
  NOT_CONNECTED: "Wallet not connected",
  TX_TOO_BIG: "Transaction too big",
  FAILED_PROTOCOL_PARAMETER: "FAILED_PROTOCOL_PARAMETER",
};

export interface CIP0030API {
  getBalance: () => Promise<any>;
  signData: (address: string, payload: any) => Promise<any>;
  signTx: (tx: any, partialSign?: boolean) => Promise<any>;
  submitTx: (tx: any) => Promise<any>;
  getUtxos: (amount?: number, paginate?: any) => Promise<string[]>;
  getUsedAddresses: () => Promise<Address[]>;
  getUnusedAddresses: () => Promise<Address[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<Address[]>;
  getNetworkId: () => Promise<number>;
  experimental?: {
    [key: string]: any;
  };
}

export interface CIP0030Wallets {
  [key: string]: CIP0030Wallet;
}

export interface CIP0030Wallet {
  enable: () => Promise<CIP0030API>;
  isEnabled: () => Promise<boolean>;
  apiVersion: string;
  name: string;
  icon: string;
  api: CIP0030API;
}

class WalletApi {
  wallet: CIP0030Wallet | undefined;
  serialLib: any;

  constructor(serilizationLib: any, walletApi: CIP0030Wallet | undefined) {
    this.wallet = walletApi;
    this.serialLib = serilizationLib;
  }

  async disconnectWallet() {
    this.wallet = undefined;
  }

  async isEnabled() {
    return await this.wallet?.isEnabled();
  }

  async enable(walletKey: WalletKeys) {
    if (!(await this.isEnabled())) {
      try {
        return await window.cardano[WalletKeys[walletKey]].enable();
      } catch (error: any) {
        return (error.message || error.info) as string;
      }
    }
  }

  async getAddress() {
    if (!this.isEnabled() || !this.wallet) throw ERROR.NOT_CONNECTED;

    const addresses = await this.wallet.api.getUsedAddresses();
    const addressHex = Buffer.from(addresses[0] as any, "hex");

    const address = this.serialLib?.BaseAddress?.from_address(
      this.serialLib.Address.from_bytes(addressHex)
    )
      .to_address()
      .to_bech32();

    return address;
  }

  async getNetworkId() {
    if (!this.isEnabled() || !this.wallet) throw ERROR.NOT_CONNECTED;

    let networkId = await this.wallet.api.getNetworkId();
    return {
      network: networkId as NetworkId,
    };
  }

  async getBalance() {
    if (!this.isEnabled() || !this.wallet) throw ERROR.NOT_CONNECTED;

    let networkId = await this.getNetworkId();
    let protocolParameter = await this._getProtocolParameter(networkId.network);

    // const valueCBOR = await this.wallet.api.getBalance()
    // const value = this.serialLib.Value.from_bytes(Buffer.from(valueCBOR, "hex"))

    const utxos = await this.wallet.api.getUtxos();
    if (utxos) {
      const parsedUtxos = utxos.map(
        (utxo: any | { [Symbol.toPrimitive](hint: "string"): string }) =>
          this.serialLib.TransactionUnspentOutput.from_bytes(
            Buffer.from(utxo, "hex")
          )
      );

      let countedValue = this.serialLib.Value.new(
        this.serialLib.BigNum.from_str("0")
      );
      parsedUtxos.forEach(
        (element: {
          output: () => {
            (): any;
            new (): any;
            amount: { (): any; new (): any };
          };
        }) => {
          countedValue = countedValue.checked_add(element.output().amount());
        }
      );
      const minAda = this.serialLib.min_ada_required(
        countedValue,
        false,
        this.serialLib.BigNum.from_str(protocolParameter.minUtxo)
      );

      const availableAda = countedValue.coin().checked_sub(minAda);
      const lovelace = availableAda.to_str();

      return {
        lovelace: lovelace,
        assets: "",
      };
    }
    return {};
  }

  async transferAda(paymentAddress: string, adaAmount: string) {
    if (!this.wallet) return;

    let networkId = await this.getNetworkId();
    const protocolParameters = await this._getProtocolParameter(
      networkId.network
    );

    const changeAddress =
      await (this.wallet?.api.getChangeAddress() as Promise<string>);
    // Cast according to wallet
    if (changeAddress) {
      const account = this.wallet.api;
      // change address
      const address = await account.getChangeAddress();
      const changeAddress = this.serialLib.Address.from_bytes(
        Buffer.from(address, "hex")
      ).to_bech32();

      // config
      const txConfig = this.serialLib.TransactionBuilderConfigBuilder.new()
        .coins_per_utxo_word(
          this.serialLib.BigNum.from_str(
            String(protocolParameters.coinsPerUtxoWord)
          )
        )
        .fee_algo(
          this.serialLib.LinearFee.new(
            this.serialLib.BigNum.from_str(
              String(protocolParameters.linearFee.minFeeA)
            ),
            this.serialLib.BigNum.from_str(
              String(protocolParameters.linearFee.minFeeB)
            )
          )
        )
        .key_deposit(
          this.serialLib.BigNum.from_str(String(protocolParameters.keyDeposit))
        )
        .pool_deposit(
          this.serialLib.BigNum.from_str(String(protocolParameters.poolDeposit))
        )
        .max_tx_size(protocolParameters.maxTxSize)
        .max_value_size(protocolParameters.maxValSize)
        .prefer_pure_change(true)
        .build();

      // builder
      const txBuilder = this.serialLib.TransactionBuilder.new(txConfig);

      // outputs
      txBuilder.add_output(
        this.serialLib.TransactionOutputBuilder.new()
          .with_address(this.serialLib.Address.from_bech32(paymentAddress))
          .next()
          .with_value(
            this.serialLib.Value.new(this.serialLib.BigNum.from_str(adaAmount))
          )
          .build()
      );

      // convert utxos from wallet connector
      const utxosFromWalletConnector = (await account.getUtxos()).map((utxo) =>
        this.serialLib.TransactionUnspentOutput.from_bytes(
          Buffer.from(utxo, "hex")
        )
      );

      // create TransactionUnspentOutputs for 'add_inputs_from' function
      const utxoOutputs = this.serialLib.TransactionUnspentOutputs.new();
      utxosFromWalletConnector.map((currentUtxo) =>
        utxoOutputs.add(currentUtxo)
      );

      // inputs with coin selection
      // 0 for LargestFirst, 1 RandomImprove 2,3 Mutli asset
      txBuilder.add_inputs_from(utxoOutputs, 0);
      txBuilder.add_change_if_needed(
        this.serialLib.Address.from_bech32(changeAddress)
      );

      const txBody = txBuilder.build();
      const transaction = this.serialLib.Transaction.new(
        txBuilder.build(),
        this.serialLib.TransactionWitnessSet.new()
      );

      let witness;
      try {
        witness = await account.signTx(
          Buffer.from(transaction.to_bytes(), "hex").toString("hex")
        );
      } catch (error: any) {
        return (error.message || error.info) as string;
      }

      const signedTx = this.serialLib.Transaction.new(
        txBody,
        this.serialLib.TransactionWitnessSet.from_bytes(
          Buffer.from(witness, "hex")
        ),
        undefined // transaction metadata
      );

      const txHash = await account.submitTx(
        Buffer.from(signedTx.to_bytes()).toString("hex")
      );

      return txHash;
    }
    return undefined;
  }

  async getUtxos(utxos: any[]) {
    let Utxos = utxos.map(
      (
        u:
          | WithImplicitCoercion<string>
          | { [Symbol.toPrimitive](hint: "string"): string }
      ) =>
        this.serialLib.TransactionUnspentOutput.from_bytes(
          Buffer.from(u, "hex")
        )
    );
    let UTXOS = [];
    for (let utxo of Utxos) {
      let assets = this._utxoToAssets(utxo);

      UTXOS.push({
        txHash: Buffer.from(
          utxo.input().transaction_id().to_bytes(),
          "hex"
        ).toString("hex"),
        txId: utxo.input().index(),
        amount: assets,
      });
    }
    return UTXOS;
  }

  _utxoToAssets(utxo: {
    output: () => {
      (): any;
      new (): any;
      amount: { (): any; new (): any };
    };
  }) {
    let value = utxo.output().amount();
    const assets = [];
    assets.push({
      unit: "lovelace",
      quantity: value.coin().to_str(),
    });
    if (value.multiasset()) {
      const multiAssets = value.multiasset().keys();
      for (let j = 0; j < multiAssets.len(); j++) {
        const policy = multiAssets.get(j);
        const policyAssets = value.multiasset().get(policy);
        const assetNames = policyAssets.keys();
        for (let k = 0; k < assetNames.len(); k++) {
          const policyAsset = assetNames.get(k);
          const quantity = policyAssets.get(policyAsset);
          const asset =
            Buffer.from(policy.to_bytes()).toString("hex") +
            "." +
            Buffer.from(policyAsset.name()).toString("ascii");

          assets.push({
            unit: asset,
            quantity: quantity.to_str(),
          });
        }
      }
    }
    return assets;
  }

  async _getProtocolParameter(networkId: number) {
    let epochParams: any = await getEpochParams();

    return {
      linearFee: {
        minFeeA: epochParams.min_fee_a.toString(),
        minFeeB: epochParams.min_fee_b.toString(),
      },
      poolDeposit: epochParams.pool_deposit,
      keyDeposit: epochParams.key_deposit,
      coinsPerUtxoWord: epochParams.coins_per_utxo_size
        ? epochParams.coins_per_utxo_size
        : epochParams.coins_per_utxo_word,
      maxValSize: epochParams.max_val_size,
      priceMem: epochParams.price_mem,
      priceStep: epochParams.price_step,
      maxTxSize: parseInt(epochParams.max_tx_size),
      minUtxo: "1000000", //p.min_utxo, minUTxOValue protocol paramter has been removed since Alonzo HF. Calulation of minADA works differently now, but 1 minADA still sufficient for now
    };
  }

  async _koiosRequest() {}
}

export default WalletApi;
