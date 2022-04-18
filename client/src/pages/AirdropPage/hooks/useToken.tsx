import {
    Token,
    PolicyIDAndAssetNameToAmountMap,
    PolicyIDAndAssetNameToAdaAddressMap,
    AdaAddress,
    TokenAddress,
} from "../utils";
import { parseUtxo, convertBufferToHex } from "./helper";
import { useEffect, useState } from "react";
import WalletApi from "src/services/connectors/wallet.connector";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

interface Props {
    connectedWallet: WalletApi | undefined;
}

const useToken = ({ connectedWallet }: Props) => {
    const [selectedToken, setSelectedToken] = useState("");
    const [tokens, setTokens] = useState<Token[]>([]);
    const wallet = useSelector((state: RootState) => state.wallet);

    useEffect(() => {
        // if (connectedWallet) {
        //     getTokenArrayInWallet()
        // }
        (() => {
            console.log(wallet);
        })();
    }, []);

    const getTokenArrayInWallet = async (API: any): Promise<void> => {
        try {
            /**
             * Only fetch usable UTXOs
             * check another function to get the collateral
             */
            const assetAmount: PolicyIDAndAssetNameToAmountMap = {};
            const assetAddresses: PolicyIDAndAssetNameToAdaAddressMap = {};
            const rawUtxos: string[] = await API.getUtxos();
            const parsedUtxos = rawUtxos.map((rawUtxo) => parseUtxo(rawUtxo));
            const addressContainingAda: AdaAddress[] = [];
            let addressAmountObj: TokenAddress;

            for (const parsedUtxo of parsedUtxos) {
                const { multiasset, address, amount } = parsedUtxo;
                addressContainingAda.push({ address, adaAmount: amount });

                /**
                 * if utxo contains asset other than ada
                 * check them
                 */
                if (!multiasset) continue;

                const keys = multiasset.keys();
                const numberOfAssetType = keys.len();

                for (let i = 0; i < numberOfAssetType; i++) {
                    const policyId = keys.get(i);
                    const assets = multiasset.get(policyId);

                    if (assets == null) continue;

                    const assetNames = assets.keys();
                    const K = assetNames.len();

                    const policyIdString = convertBufferToHex(
                        policyId.to_bytes()
                    );

                    if (!assetAmount[policyIdString]) {
                        assetAmount[policyIdString] = {};
                    }

                    if (!assetAddresses[policyIdString]) {
                        assetAddresses[policyIdString] = {};
                    }

                    for (let j = 0; j < K; j++) {
                        const assetName = assetNames.get(j);
                        const assetNameHex = Buffer.from(
                            (assetName as any).name(),
                            "utf8"
                        ).toString("hex");
                        const multiassetAmt = multiasset.get_asset(
                            policyId,
                            assetName
                        );
                        const assetAmountInUtxo = Number(
                            multiassetAmt.to_str()
                        );

                        if (!assetAmount[policyIdString][assetNameHex]) {
                            assetAmount[policyIdString][assetNameHex] = 0;
                        }
                        assetAmount[policyIdString][assetNameHex] +=
                            assetAmountInUtxo;

                        addressAmountObj = {
                            address,
                            tokenAmount: assetAmountInUtxo,
                            adaAmount: amount,
                        };

                        if (!assetAddresses[policyIdString][assetNameHex]) {
                            assetAddresses[policyIdString][assetNameHex] = [];
                        }
                        assetAddresses[policyIdString][assetNameHex].push(
                            addressAmountObj
                        );
                    }
                }
            }

            console.log(assetAddresses);

            //   const assetDetail = await getAssetDetails(assetAmount);
            //   const tokenArray = getCompleteTokenArray(
            //     assetAmount,
            //     assetAddresses,
            //     assetDetail
            //   );
            //   tokenArray.sort((a, b) => (a.name < b.name ? -1 : 1));
            //   dispatch(setAddressContainingAda(addressContainingAda));
            //   dispatch(setTokenArray(tokenArray));
        } catch (err) {
            //   setPopUpError("Something is wrong");
        }
    };

    return {
        selectedToken,
        tokens,
        setSelectedToken,
    };
};

export default useToken;
