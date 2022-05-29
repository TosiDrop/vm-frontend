import Loader from "./loader";
import { Buffer } from "buffer";
import { Address } from "@emurgo/cardano-serialization-lib-asmjs";
import { NetworkId } from "src/entities/common.entities";

declare global {
    interface Window { cardano: CIP0030Wallets; }
}

if (typeof window !== 'undefined') {
    window.cardano = window.cardano as CIP0030Wallets;
}

export async function Cardano() {
    await Loader.load();
    return Loader.Cardano;
};

export enum WalletKeys {
    nami = 'nami',
    eternl = 'eternl',
    flint = 'flint',
    typhon = 'typhoncip30',
    gerowallet = 'gerowallet',
    anetawallet = 'anetawallet'
}

const ERROR = {
    NOT_CONNECTED: 'Wallet not connected',
    TX_TOO_BIG: 'Transaction too big',
    FAILED_PROTOCOL_PARAMETER: 'FAILED_PROTOCOL_PARAMETER',
}

export interface CIP0030API {
    getBalance: () => Promise<any>,
    signData: (address: string, payload: any) => Promise<any>,
    signTx: (tx: any, partialSign?: boolean) => Promise<any>,
    submitTx: (tx: any) => Promise<any>,
    getUtxos: (amount?: number, paginate?: any) => Promise<string[]>,
    getUsedAddresses: () => Promise<Address[]>
    getUnusedAddresses: () => Promise<Address[]>,
    getChangeAddress: () => Promise<string>,
    getRewardAddresses: () => Promise<Address[]>,
    getNetworkId: () => Promise<number>,
    experimental?: {
        [key: string]: any
    }
}

export interface CIP0030Wallets {
    [key: string]: CIP0030Wallet
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
    apiKey: string;

    constructor(serilizationLib: any, walletApi: CIP0030Wallet | undefined, _apiKey: string) {
        this.wallet = walletApi;
        this.serialLib = serilizationLib;
        this.apiKey = _apiKey;
    }

    async disconnectWallet() {
        this.wallet = undefined;
    }

    async isEnabled() {
        return await this.wallet?.isEnabled();
    }

    async enable(walletKey: WalletKeys) {
        if (!await this.isEnabled()) {
            try {
                return await window.cardano[WalletKeys[walletKey]].enable();
            } catch (error: any) {
                return (error.message || error.info) as string;
            }
        }
    }

    async getAddress() {
        if (!this.isEnabled() || !this.wallet) throw ERROR.NOT_CONNECTED;

        const addresses = await this.wallet.api.getUsedAddresses()
        const addressHex = Buffer.from(
            addresses[0] as any,
            "hex"
        );

        const address = this.serialLib?.BaseAddress?.from_address(
            this.serialLib.Address.from_bytes(addressHex)
        )
            .to_address()
            .to_bech32();


        return address;
    }

    async getNetworkId() {
        if (!this.isEnabled() || !this.wallet) throw ERROR.NOT_CONNECTED;

        let networkId = await this.wallet.api.getNetworkId()
        return {
            network: networkId as NetworkId
        }
    }


    async getBalance() {
        if (!this.isEnabled() || !this.wallet) throw ERROR.NOT_CONNECTED;

        let networkId = await this.getNetworkId();
        let protocolParameter = await this._getProtocolParameter(networkId.network)

        // const valueCBOR = await this.wallet.api.getBalance()
        // const value = this.serialLib.Value.from_bytes(Buffer.from(valueCBOR, "hex"))

        const utxos = await this.wallet.api.getUtxos()
        if (utxos) {
            const parsedUtxos = utxos.map((utxo: any | { [Symbol.toPrimitive](hint: "string"): string; }) => this.serialLib.TransactionUnspentOutput.from_bytes(Buffer.from(utxo, "hex")))

            let countedValue = this.serialLib.Value.new(this.serialLib.BigNum.from_str("0"))
            parsedUtxos.forEach((element: { output: () => { (): any; new(): any; amount: { (): any; new(): any; }; }; }) => { countedValue = countedValue.checked_add(element.output().amount()) });
            const minAda = this.serialLib.min_ada_required(countedValue, false, this.serialLib.BigNum.from_str(protocolParameter.minUtxo));

            const availableAda = countedValue.coin().checked_sub(minAda);
            const lovelace = availableAda.to_str();
            // console.log("assets", protocolParameter.minUtxo)
            // const assets = [];
            // if (value.multiasset()) {
            //     const multiAssets = value.multiasset().keys();
            //     for (let j = 0; j < multiAssets.len(); j++) {
            //         const policy = multiAssets.get(j);
            //         const policyAssets = value.multiasset().get(policy);
            //         const assetNames = policyAssets.keys();
            //         for (let k = 0; k < assetNames.len(); k++) {
            //             const policyAsset = assetNames.get(k);
            //             const quantity = policyAssets.get(policyAsset);
            //             const asset =
            //                 Buffer.from(policy.to_bytes(), 'hex').toString('hex') +
            //                 Buffer.from(policyAsset.name(), 'hex').toString('hex');
            //             const _policy = asset.slice(0, 56);
            //             const _name = asset.slice(56);
            //             const fingerprint = AssetFingerprint.fromParts(
            //                 Buffer.from(_policy, 'hex'),
            //                 Buffer.from(_name, 'hex')
            //             ).fingerprint();
            //             assets.push({
            //                 unit: asset,
            //                 quantity: quantity.to_str(),
            //                 policy: _policy,
            //                 name: HexToAscii(_name),
            //                 fingerprint,
            //             });
            //         }
            //     }
            // }

            return {
                "lovelace": lovelace,
                "assets": ''
            }
        }
        return {};
    };

    async transferAda(paymentAddress: string, adaAmount: string) {
        if (!this.wallet) return;

        let networkId = await this.getNetworkId();
        const protocolParameters = await this._getProtocolParameter(networkId.network);
        const changeAddress = await (this.wallet?.api.getChangeAddress() as Promise<string>);
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
                    this.serialLib.BigNum.from_str(protocolParameters.coinsPerUtxoWord)
                )
                .fee_algo(
                    this.serialLib.LinearFee.new(
                        this.serialLib.BigNum.from_str(protocolParameters.linearFee.minFeeA),
                        this.serialLib.BigNum.from_str(protocolParameters.linearFee.minFeeB)
                    )
                )
                .key_deposit(this.serialLib.BigNum.from_str(protocolParameters.keyDeposit))
                .pool_deposit(this.serialLib.BigNum.from_str(protocolParameters.poolDeposit))
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
                    .with_value(this.serialLib.Value.new(this.serialLib.BigNum.from_str(adaAmount)))
                    .build()
            );

            // convert utxos from wallet connector
            const utxosFromWalletConnector = (await account.getUtxos()).map((utxo) =>
                this.serialLib.TransactionUnspentOutput.from_bytes(Buffer.from(utxo, "hex"))
            );

            // create TransactionUnspentOutputs for 'add_inputs_from' function
            const utxoOutputs = this.serialLib.TransactionUnspentOutputs.new();
            utxosFromWalletConnector.map((currentUtxo) => utxoOutputs.add(currentUtxo));

            // inputs with coin selection
            // 0 for LargestFirst, 1 RandomImprove 2,3 Mutli asset
            txBuilder.add_inputs_from(utxoOutputs, 0);
            txBuilder.add_change_if_needed(this.serialLib.Address.from_bech32(changeAddress));

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
                this.serialLib.TransactionWitnessSet.from_bytes(Buffer.from(witness, "hex")),
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
        let Utxos = utxos.map((u: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }) => this.serialLib.TransactionUnspentOutput.from_bytes(
            Buffer.from(
                u,
                'hex'
            )
        ))
        let UTXOS = []
        for (let utxo of Utxos) {
            let assets = this._utxoToAssets(utxo)

            UTXOS.push({
                txHash: Buffer.from(
                    utxo.input().transaction_id().to_bytes(),
                    'hex'
                ).toString('hex'),
                txId: utxo.input().index(),
                amount: assets
            })
        }
        return UTXOS
    }

    _utxoToAssets(utxo: { output: () => { (): any; new(): any; amount: { (): any; new(): any; }; }; }) {
        let value = utxo.output().amount()
        const assets = [];
        assets.push({
            unit: 'lovelace',
            quantity: value.coin().to_str()
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
                        Buffer.from(
                            policy.to_bytes()
                        ).toString('hex') + "." +
                        Buffer.from(
                            policyAsset.name()
                        ).toString('ascii')


                    assets.push({
                        unit: asset,
                        quantity: quantity.to_str(),
                    });
                }
            }
        }
        return assets;
    }

    // async registerPolicy(policy: { id: any; paymentKeyHash: any; ttl: any; }) {
    //     fetch(`https://pool.pm/register/policy/${policy.id}`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             type: "all",
    //             scripts: [
    //                 {
    //                     keyHash: policy.paymentKeyHash,
    //                     type: "sig",
    //                 },
    //                 { slot: policy.ttl, type: "before" },
    //             ],
    //         }),
    //     })
    //         .then((res) => res.json())
    //         .then(console.log);
    // }

    // async getUtxosHex() {
    //     if (!this.isEnabled() || !this.wallet) throw ERROR.NOT_CONNECTED;
    //     return await this.wallet.api.getUtxos()
    // }

    // async createLockingPolicyScript(address: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }, networkId: any, expirationTime: { getTime: () => number; }) {

    //     var now = new Date()

    //     const protocolParameters = await this._getProtocolParameter(networkId);

    //     const slot = parseInt(protocolParameters.slot);
    //     const duration = expirationTime.getTime() - now.getTime()


    //     const ttl = slot + duration;

    //     const paymentKeyHash = this.serialLib.BaseAddress.from_address(
    //         this.serialLib.Address.from_bytes(
    //             Buffer.from(address, "hex")

    //         ))
    //         .payment_cred()
    //         .to_keyhash();

    //     const nativeScripts = this.serialLib.NativeScripts.new();
    //     const script = this.serialLib.ScriptPubkey.new(paymentKeyHash);
    //     const nativeScript = this.serialLib.NativeScript.new_script_pubkey(script);
    //     const lockScript = this.serialLib.NativeScript.new_timelock_expiry(
    //         this.serialLib.TimelockExpiry.new(ttl)
    //     );
    //     nativeScripts.add(nativeScript);
    //     nativeScripts.add(lockScript);
    //     const finalScript = this.serialLib.NativeScript.new_script_all(
    //         this.serialLib.ScriptAll.new(nativeScripts)
    //     );
    //     const policyId = Buffer.from(
    //         this.serialLib.ScriptHash.from_bytes(
    //             finalScript.hash().to_bytes()
    //         ).to_bytes(),
    //         "hex"
    //     ).toString("hex");

    //     return {
    //         id: policyId,
    //         script: Buffer.from(finalScript.to_bytes()).toString("hex"),
    //         paymentKeyHash: Buffer.from(paymentKeyHash.to_bytes(), "hex").toString("hex"),
    //         ttl
    //     };
    // }

    // async signData(string: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }) {
    //     if (!this.isEnabled() || !this.wallet) throw ERROR.NOT_CONNECTED;
    //     // let address = await getAddressHex();
    //     let coseSign1Hex = await this.wallet.api.signData(
    //         address,
    //         Buffer.from(
    //             string,
    //             "ascii"
    //         ).toString('hex')
    //     )
    //     return coseSign1Hex
    // }

    // hashMetadata(metadata: { [s: string]: unknown; } | ArrayLike<unknown>) {
    //     let aux = this.serialLib.AuxiliaryData.new()


    //     const generalMetadata = this.serialLib.GeneralTransactionMetadata.new();
    //     Object.entries(metadata).map(([MetadataLabel, Metadata]) => generalMetadata.insert(
    //         this.serialLib.BigNum.from_str(MetadataLabel),
    //         this.serialLib.encode_json_str_to_metadatum(JSON.stringify(Metadata), 0)
    //     ));

    //     aux.set_metadata(generalMetadata);

    //     const metadataHash = this.serialLib.hash_auxiliary_data(aux);
    //     return Buffer.from(metadataHash.to_bytes(), "hex").toString("hex")

    // }

    //////////////////////////////////////////////////

    // _makeMintedAssets(mintedAssets: any) {

    //     let AssetsMap: any = {}

    //     for (let asset of mintedAssets) {
    //         let assetName = asset.assetName
    //         let quantity = asset.quantity
    //         if (!Array.isArray(AssetsMap[asset.policyId])) {
    //             AssetsMap[asset.policyId] = []
    //         }
    //         AssetsMap[asset.policyId].push({
    //             "unit": Buffer.from(assetName, 'ascii').toString('hex'),
    //             "quantity": quantity
    //         })

    //     }
    //     let multiAsset = this.serialLib.MultiAsset.new()

    //     for (const policy in AssetsMap) {

    //         const ScriptHash = this.serialLib.ScriptHash.from_bytes(
    //             Buffer.from(policy, 'hex')
    //         )
    //         const Assets = this.serialLib.Assets.new()

    //         const _assets = AssetsMap[policy]

    //         for (const asset of _assets) {
    //             const AssetName = this.serialLib.AssetName.new(Buffer.from(asset.unit, 'hex'))
    //             const BigNum = this.serialLib.BigNum.from_str(asset.quantity)

    //             Assets.insert(AssetName, BigNum)
    //         }

    //         multiAsset.insert(ScriptHash, Assets)

    //     }
    //     const value = this.serialLib.Value.new(
    //         this.serialLib.BigNum.from_str("0")
    //     );

    //     value.set_multiasset(multiAsset);
    //     return value
    // }

    // _makeMultiAsset(assets: any) {

    //     let AssetsMap: any = {}
    //     for (let asset of assets) {
    //         let [policy, assetName] = asset.unit.split('.')
    //         let quantity = asset.quantity
    //         if (!Array.isArray(AssetsMap[policy])) {
    //             AssetsMap[policy] = []
    //         }
    //         AssetsMap[policy].push({
    //             "unit": Buffer.from(assetName, 'ascii').toString('hex'),
    //             "quantity": quantity
    //         })

    //     }

    //     let multiAsset = this.serialLib.MultiAsset.new()

    //     for (const policy in AssetsMap) {

    //         const ScriptHash = this.serialLib.ScriptHash.from_bytes(
    //             Buffer.from(policy, 'hex')
    //         )
    //         const Assets = this.serialLib.Assets.new()

    //         const _assets = AssetsMap[policy]

    //         for (const asset of _assets) {
    //             const AssetName = this.serialLib.AssetName.new(Buffer.from(asset.unit, 'hex'))
    //             const BigNum = this.serialLib.BigNum.from_str(asset.quantity.toString())

    //             Assets.insert(AssetName, BigNum)
    //         }

    //         multiAsset.insert(ScriptHash, Assets)

    //     }

    //     return multiAsset
    // }

    // async submitTx({
    //     transactionRaw,
    //     witnesses,
    //     scripts,
    //     networkId,
    //     metadata
    // }: any) {
    //     let transaction = this.serialLib.Transaction.from_bytes(Buffer.from(transactionRaw, "hex"))


    //     const txWitnesses = transaction.witness_set();
    //     const txVkeys = txWitnesses.vkeys();
    //     const txScripts = txWitnesses.native_scripts();


    //     const addWitnesses = this.serialLib.TransactionWitnessSet.from_bytes(
    //         Buffer.from(witnesses[0], "hex")
    //     );
    //     const addVkeys = addWitnesses.vkeys();
    //     const addScripts = addWitnesses.native_scripts();

    //     const totalVkeys = this.serialLib.Vkeywitnesses.new();
    //     const totalScripts = this.serialLib.NativeScripts.new();

    //     if (txVkeys) {
    //         for (let i = 0; i < txVkeys.len(); i++) {
    //             totalVkeys.add(txVkeys.get(i));
    //         }
    //     }
    //     if (txScripts) {
    //         for (let i = 0; i < txScripts.len(); i++) {
    //             totalScripts.add(txScripts.get(i));
    //         }
    //     }
    //     if (addVkeys) {
    //         for (let i = 0; i < addVkeys.len(); i++) {
    //             totalVkeys.add(addVkeys.get(i));
    //         }
    //     }
    //     if (addScripts) {
    //         for (let i = 0; i < addScripts.len(); i++) {
    //             totalScripts.add(addScripts.get(i));
    //         }
    //     }

    //     const totalWitnesses = this.serialLib.TransactionWitnessSet.new();
    //     totalWitnesses.set_vkeys(totalVkeys);
    //     totalWitnesses.set_native_scripts(totalScripts);
    //     let aux;
    //     if (metadata) {
    //         aux = this.serialLib.AuxiliaryData.new()
    //         const generalMetadata = this.serialLib.GeneralTransactionMetadata.new();
    //         Object.entries(metadata).map(([MetadataLabel, Metadata]) => generalMetadata.insert(
    //             this.serialLib.BigNum.from_str(MetadataLabel),
    //             this.serialLib.encode_json_str_to_metadatum(JSON.stringify(Metadata), 0)
    //         ));

    //         aux.set_metadata(generalMetadata)
    //     } else {
    //         aux = transaction.auxiliary_data();
    //     }
    //     const signedTx = await this.serialLib.Transaction.new(
    //         transaction.body(),
    //         totalWitnesses,
    //         aux
    //     );

    //     const txhash = await this._blockfrostRequest({
    //         endpoint: `/tx/submit`,
    //         headers: {
    //             "Content-Type": "application/cbor"
    //         },
    //         body: Buffer.from(signedTx.to_bytes(), "hex"),
    //         networkId: networkId,
    //         method: "POST"
    //     });

    //     return txhash
    // }

    // TODO: Change to koios
    async _getProtocolParameter(networkId: number) {
        let result = await this._blockfrostRequest({
            endpoint: `/epochs/latest/parameters`,
            networkId: networkId,
            method: "GET"
        });

        return {
            linearFee: {
                minFeeA: result.min_fee_a.toString(),
                minFeeB: result.min_fee_b.toString(),
            },
            poolDeposit: result.pool_deposit,
            keyDeposit: result.key_deposit,
            coinsPerUtxoWord: result.coins_per_utxo_word,
            maxValSize: result.max_val_size,
            priceMem: result.price_mem,
            priceStep: result.price_step,
            maxTxSize: parseInt(result.max_tx_size),
            minUtxo: '1000000', //p.min_utxo, minUTxOValue protocol paramter has been removed since Alonzo HF. Calulation of minADA works differently now, but 1 minADA still sufficient for now
        };
    }

    async _blockfrostRequest({
        body,
        endpoint = "",
        networkId = 0,
        headers = {},
        method = "GET"
    }: any) {
        let networkEndpoint = networkId === 0 ?
            'https://cardano-testnet.blockfrost.io/api/v0' :
            'https://cardano-mainnet.blockfrost.io/api/v0'

        try {
            return await (await fetch(`${networkEndpoint}${endpoint}`, {
                headers: {
                    project_id: this.apiKey,
                    ...headers
                },
                method: method,
                body
            })).json()
        } catch (error) {
            console.log(error)
            return null
        }
    }

}

export default WalletApi;
