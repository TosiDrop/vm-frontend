import Loader from "./loader";
import { Buffer } from "buffer";
import AssetFingerprint from '@emurgo/cip14-js';


export async function Cardano() {
    await Loader.load();
    return Loader.Cardano;
};

const ERROR = {
    NOT_CONNECTED: 'Wallet not connected',
    TX_TOO_BIG: 'Transaction too big'
}

class WalletApi {
    cardano: any;
    walletKey: string;
    serialLib: any;
    apiKey: string;


    constructor(serilizationLib: any, _cardano: any, _apiKey: string, _walletKey: string) {
        this.cardano = _cardano;
        this.serialLib = serilizationLib;
        this.walletKey = _walletKey;
        this.apiKey = _apiKey;
    }

    // Nami Wallet Endpoints
    async isInstalled() {
        if (this.cardano[this.walletKey]) return true
        else return false
    }

    async isEnabled() {
        return await this.cardano[this.walletKey].isEnabled()
    }

    async enable() {
        if (!await this.isEnabled()) {
            try {
                return await this.cardano[this.walletKey].enable();
            } catch (error) {
                throw error;
            }
        }
    }

    async getAddress() {

        if (!this.isEnabled()) throw ERROR.NOT_CONNECTED;

        const addressHex = Buffer.from(
            (await this.cardano.getUsedAddresses())[0],
            "hex"
        );

        const address = this.serialLib.BaseAddress.from_address(
            this.serialLib.Address.from_bytes(addressHex)
        )
            .to_address()
            .to_bech32();


        return address;

    }
    async getHexAddress() {
        const addressHex = Buffer.from(
            (await window.cardano.getUsedAddresses())[0],
            "hex"
        );
        return addressHex
    }

    async getNetworkId() {
        if (!this.isEnabled()) throw ERROR.NOT_CONNECTED;
        let networkId = await this.cardano.getNetworkId()
        return {
            id: networkId,
            network: networkId === 1 ? 'mainnet' : 'testnet'
        }
    }


    async getBalance() {
        // get balance of Nami Wallet
        if (!this.isEnabled()) {
            await this.enable()
        }
        let networkId = await this.getNetworkId();
        let protocolParameter = await this._getProtocolParameter(networkId.id)

        const valueCBOR = await this.cardano[this.walletKey].getBalance()
        const value = this.serialLib.Value.from_bytes(Buffer.from(valueCBOR, "hex"))

        const utxos = await this.cardano[this.walletKey].getUtxos()
        const parsedUtxos = utxos.map((utxo: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }) => this.serialLib.TransactionUnspentOutput.from_bytes(Buffer.from(utxo, "hex")))

        let countedValue = this.serialLib.Value.new(this.serialLib.BigNum.from_str("0"))
        parsedUtxos.forEach((element: { output: () => { (): any; new(): any; amount: { (): any; new(): any; }; }; }) => { countedValue = countedValue.checked_add(element.output().amount()) });
        const minAda = this.serialLib.min_ada_required(countedValue, this.serialLib.BigNum.from_str(protocolParameter.minUtxo));

        const availableAda = countedValue.coin().checked_sub(minAda);
        const lovelace = availableAda.to_str();
        console.log("assets", protocolParameter.minUtxo)
        const assets = [];
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
                        Buffer.from(policy.to_bytes(), 'hex').toString('hex') +
                        Buffer.from(policyAsset.name(), 'hex').toString('hex');
                    const _policy = asset.slice(0, 56);
                    const _name = asset.slice(56);
                    const fingerprint = AssetFingerprint.fromParts(
                        Buffer.from(_policy, 'hex'),
                        Buffer.from(_name, 'hex')
                    ).fingerprint();
                    assets.push({
                        unit: asset,
                        quantity: quantity.to_str(),
                        policy: _policy,
                        name: HexToAscii(_name),
                        fingerprint,
                    });
                }
            }
        }

        return {
            "lovelace": lovelace,
            "assets": assets
        }
    };

    getApiKey(networkId: number) {
        if (networkId == 0) {
            return this.apiKey[0]

        } else {
            return this.apiKey[1]

        }
    }

    async registerPolicy(policy: { id: any; paymentKeyHash: any; ttl: any; }) {
        fetch(`https://pool.pm/register/policy/${policy.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "all",
                scripts: [
                    {
                        keyHash: policy.paymentKeyHash,
                        type: "sig",
                    },
                    { slot: policy.ttl, type: "before" },
                ],
            }),
        })
            .then((res) => res.json())
            .then(console.log);
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

    async getUtxosHex() {
        return await this.cardano[this.walletKey].getUtxos()
    }

    async createLockingPolicyScript(address: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }, networkId: any, expirationTime: { getTime: () => number; }) {

        var now = new Date()

        const protocolParameters = await this._getProtocolParameter(networkId);

        const slot = parseInt(protocolParameters.slot);
        const duration = expirationTime.getTime() - now.getTime()


        const ttl = slot + duration;

        const paymentKeyHash = this.serialLib.BaseAddress.from_address(
            this.serialLib.Address.from_bytes(
                Buffer.from(address, "hex")

            ))
            .payment_cred()
            .to_keyhash();

        const nativeScripts = this.serialLib.NativeScripts.new();
        const script = this.serialLib.ScriptPubkey.new(paymentKeyHash);
        const nativeScript = this.serialLib.NativeScript.new_script_pubkey(script);
        const lockScript = this.serialLib.NativeScript.new_timelock_expiry(
            this.serialLib.TimelockExpiry.new(ttl)
        );
        nativeScripts.add(nativeScript);
        nativeScripts.add(lockScript);
        const finalScript = this.serialLib.NativeScript.new_script_all(
            this.serialLib.ScriptAll.new(nativeScripts)
        );
        const policyId = Buffer.from(
            this.serialLib.ScriptHash.from_bytes(
                finalScript.hash().to_bytes()
            ).to_bytes(),
            "hex"
        ).toString("hex");
        return {
            id: policyId,
            script: Buffer.from(finalScript.to_bytes()).toString("hex"),
            paymentKeyHash: Buffer.from(paymentKeyHash.to_bytes(), "hex").toString("hex"),
            ttl
        };
    }


    async signTx(transaction: any, partialSign = false) {
        if (!this.isEnabled()) throw ERROR.NOT_CONNECTED;
        return await this.cardano[this.walletKey].signTx(transaction, partialSign)
    }

    async signData(string: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }) {
        // let address = await getAddressHex()
        let address = '';
        let coseSign1Hex = await this.cardano.signData(
            address,
            Buffer.from(
                string,
                "ascii"
            ).toString('hex')
        )
        return coseSign1Hex
    }

    hashMetadata(metadata: { [s: string]: unknown; } | ArrayLike<unknown>) {
        let aux = this.serialLib.AuxiliaryData.new()


        const generalMetadata = this.serialLib.GeneralTransactionMetadata.new();
        Object.entries(metadata).map(([MetadataLabel, Metadata]) => {

            generalMetadata.insert(
                this.serialLib.BigNum.from_str(MetadataLabel),
                this.serialLib.encode_json_str_to_metadatum(JSON.stringify(Metadata), 0)
            );
        });

        aux.set_metadata(generalMetadata)




        const metadataHash = this.serialLib.hash_auxiliary_data(aux);
        return Buffer.from(metadataHash.to_bytes(), "hex").toString("hex")

    }
    //////////////////////////////////////////////////

    _makeMintedAssets(mintedAssets: any) {

        let AssetsMap: any = {}

        for (let asset of mintedAssets) {
            let assetName = asset.assetName
            let quantity = asset.quantity
            if (!Array.isArray(AssetsMap[asset.policyId])) {
                AssetsMap[asset.policyId] = []
            }
            AssetsMap[asset.policyId].push({
                "unit": Buffer.from(assetName, 'ascii').toString('hex'),
                "quantity": quantity
            })

        }
        let multiAsset = this.serialLib.MultiAsset.new()

        for (const policy in AssetsMap) {

            const ScriptHash = this.serialLib.ScriptHash.from_bytes(
                Buffer.from(policy, 'hex')
            )
            const Assets = this.serialLib.Assets.new()

            const _assets = AssetsMap[policy]

            for (const asset of _assets) {
                const AssetName = this.serialLib.AssetName.new(Buffer.from(asset.unit, 'hex'))
                const BigNum = this.serialLib.BigNum.from_str(asset.quantity)

                Assets.insert(AssetName, BigNum)
            }

            multiAsset.insert(ScriptHash, Assets)

        }
        const value = this.serialLib.Value.new(
            this.serialLib.BigNum.from_str("0")
        );

        value.set_multiasset(multiAsset);
        return value
    }

    _makeMultiAsset(assets: any) {

        let AssetsMap: any = {}
        for (let asset of assets) {
            let [policy, assetName] = asset.unit.split('.')
            let quantity = asset.quantity
            if (!Array.isArray(AssetsMap[policy])) {
                AssetsMap[policy] = []
            }
            AssetsMap[policy].push({
                "unit": Buffer.from(assetName, 'ascii').toString('hex'),
                "quantity": quantity
            })

        }

        let multiAsset = this.serialLib.MultiAsset.new()

        for (const policy in AssetsMap) {

            const ScriptHash = this.serialLib.ScriptHash.from_bytes(
                Buffer.from(policy, 'hex')
            )
            const Assets = this.serialLib.Assets.new()

            const _assets = AssetsMap[policy]

            for (const asset of _assets) {
                const AssetName = this.serialLib.AssetName.new(Buffer.from(asset.unit, 'hex'))
                const BigNum = this.serialLib.BigNum.from_str(asset.quantity.toString())

                Assets.insert(AssetName, BigNum)
            }

            multiAsset.insert(ScriptHash, Assets)

        }

        return multiAsset
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

    async submitTx({
        transactionRaw,
        witnesses,
        scripts,
        networkId,
        metadata
    }: any) {


        let transaction = this.serialLib.Transaction.from_bytes(Buffer.from(transactionRaw, "hex"))


        const txWitnesses = transaction.witness_set();
        const txVkeys = txWitnesses.vkeys();
        const txScripts = txWitnesses.native_scripts();


        const addWitnesses = this.serialLib.TransactionWitnessSet.from_bytes(
            Buffer.from(witnesses[0], "hex")
        );
        const addVkeys = addWitnesses.vkeys();
        const addScripts = addWitnesses.native_scripts();

        const totalVkeys = this.serialLib.Vkeywitnesses.new();
        const totalScripts = this.serialLib.NativeScripts.new();

        if (txVkeys) {
            for (let i = 0; i < txVkeys.len(); i++) {
                totalVkeys.add(txVkeys.get(i));
            }
        }
        if (txScripts) {
            for (let i = 0; i < txScripts.len(); i++) {
                totalScripts.add(txScripts.get(i));
            }
        }
        if (addVkeys) {
            for (let i = 0; i < addVkeys.len(); i++) {
                totalVkeys.add(addVkeys.get(i));
            }
        }
        if (addScripts) {
            for (let i = 0; i < addScripts.len(); i++) {
                totalScripts.add(addScripts.get(i));
            }
        }

        const totalWitnesses = this.serialLib.TransactionWitnessSet.new();
        totalWitnesses.set_vkeys(totalVkeys);
        totalWitnesses.set_native_scripts(totalScripts);
        let aux;
        if (metadata) {


            aux = this.serialLib.AuxiliaryData.new()
            const generalMetadata = this.serialLib.GeneralTransactionMetadata.new();
            Object.entries(metadata).map(([MetadataLabel, Metadata]) => {

                generalMetadata.insert(
                    this.serialLib.BigNum.from_str(MetadataLabel),
                    this.serialLib.encode_json_str_to_metadatum(JSON.stringify(Metadata), 0)
                );
            });

            aux.set_metadata(generalMetadata)
        } else {
            aux = transaction.auxiliary_data();
        }
        const signedTx = await this.serialLib.Transaction.new(
            transaction.body(),
            totalWitnesses,
            aux
        );

        const txhash = await this._blockfrostRequest({
            endpoint: `/tx/submit`,
            headers: {
                "Content-Type": "application/cbor"
            },
            body: Buffer.from(signedTx.to_bytes(), "hex"),
            networkId: networkId,
            method: "POST"
        });

        return txhash

    }
    async _getProtocolParameter(networkId: number) {

        let latestBlock = await this._blockfrostRequest({
            endpoint: "/blocks/latest",
            networkId: networkId,
            method: "GET"
        })
        if (!latestBlock) throw 'ERROR.FAILED_PROTOCOL_PARAMETER'

        let p = await this._blockfrostRequest({
            endpoint: `/epochs/${latestBlock.epoch}/parameters`,
            networkId: networkId,
            method: "GET"
        }) // if(!p) throw ERROR.FAILED_PROTOCOL_PARAMETER

        return {
            linearFee: {
                minFeeA: p.min_fee_a.toString(),
                minFeeB: p.min_fee_b.toString(),
            },
            minUtxo: '1000000', //p.min_utxo, minUTxOValue protocol paramter has been removed since Alonzo HF. Calulation of minADA works differently now, but 1 minADA still sufficient for now
            poolDeposit: p.pool_deposit,
            keyDeposit: p.key_deposit,
            maxTxSize: p.max_tx_size,
            slot: latestBlock.slot,
        };

    }
    async _submitRequest(body: any, networkId: any) {

        let latestBlock = await this._blockfrostRequest({
            endpoint: "/blocks/latest",
            network: networkId
        })
        if (!latestBlock) throw 'ERROR.FAILED_PROTOCOL_PARAMETER'

        let p = await this._blockfrostRequest({
            endpoint: `/epochs/${latestBlock.epoch}/parameters`,
            networkId: networkId
        }) //
        if (!p) throw 'ERROR.FAILED_PROTOCOL_PARAMETER'

        return {
            linearFee: {
                minFeeA: p.min_fee_a.toString(),
                minFeeB: p.min_fee_b.toString(),
            },
            minUtxo: '1000000', //p.min_utxo, minUTxOValue protocol paramter has been removed since Alonzo HF. Calulation of minADA works differently now, but 1 minADA still sufficient for now
            poolDeposit: p.pool_deposit,
            keyDeposit: p.key_deposit,
            maxTxSize: p.max_tx_size,
            slot: latestBlock.slot,
        };

    }
    async _blockfrostRequest({
        body,
        endpoint = "",
        networkId = 0,
        headers = {},
        method = "GET"
    }: any) {
        let networkEndpoint = networkId == 0 ?
            'https://cardano-testnet.blockfrost.io/api/v0' :
            'https://cardano-mainnet.blockfrost.io/api/v0'
        let blockfrostApiKey = this.getApiKey(networkId)

        try {
            return await (await fetch(`${networkEndpoint}${endpoint}`, {
                headers: {
                    project_id: blockfrostApiKey,
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
//////////////////////////////////////////////////
//Auxiliary

function HexToBuffer(string: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }) {
    return Buffer.from(string, "hex")
}

function HexToAscii(string: string) {
    return HexToBuffer(string).toString("ascii")
}



export default WalletApi;
