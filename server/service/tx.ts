import {
  Address,
  BigNum,
  Certificate,
  Certificates,
  Ed25519KeyHash,
  LinearFee,
  StakeCredential,
  StakeDelegation,
  StakeRegistration,
  Transaction,
  TransactionBody,
  TransactionBuilder,
  TransactionBuilderConfigBuilder,
  TransactionHash,
  TransactionInput,
  TransactionOutput,
  TransactionUnspentOutput,
  TransactionUnspentOutputs,
  TransactionWitnessSet,
  Value,
} from "@emurgo/cardano-serialization-lib-nodejs";
import { CardanoService } from "./cardano";
import { KoiosService } from "./koios";

enum StakeCredentialKind {
  StakeKeyHash = 0,
  StakeScriptHash = 1,
}

enum PaymentCredential {
  PaymentKeyHash = 0,
  PaymentScriptHash = 1,
}

export namespace TxService {
  export async function createDelegationTx(
    poolId: string,
    delegatorAddress: string
  ) {
    const [tip, stakeAddress, epochParameters] = await Promise.all([
      KoiosService.getBlockchainTip(),
      CardanoService.getStakeAddress(delegatorAddress),
      KoiosService.getProtocolParameters(),
    ]);

    const stakeCredHash = CardanoService.getStakeCredHash(delegatorAddress);

    const accountInformation = await KoiosService.getAccountInformation(
      stakeAddress
    );

    const {
      coins_per_utxo_size,
      min_fee_a,
      min_fee_b,
      key_deposit,
      pool_deposit,
      max_tx_size,
      max_val_size,
    } = epochParameters;

    const feeAlgo = LinearFee.new(
      BigNum.from_str(min_fee_a.toString()),
      BigNum.from_str(min_fee_b.toString())
    );

    const txBuilderConfig = TransactionBuilderConfigBuilder.new()
      .coins_per_utxo_byte(BigNum.from_str(coins_per_utxo_size))
      .fee_algo(feeAlgo)
      .key_deposit(BigNum.from_str(key_deposit))
      .pool_deposit(BigNum.from_str(pool_deposit))
      .max_tx_size(Number(max_tx_size))
      .max_value_size(Number(max_val_size))
      .prefer_pure_change(true)
      .build();

    const txBuilder = TransactionBuilder.new(txBuilderConfig);
    txBuilder.set_ttl_bignum(BigNum.from_str((tip.abs_slot + 3600).toString()));

    const certs = Certificates.new();

    if (accountInformation.status !== "registered") {
      certs.add(
        Certificate.new_stake_registration(
          StakeRegistration.new(
            StakeCredential.from_keyhash(Ed25519KeyHash.from_hex(stakeCredHash))
          )
        )
      );
    }

    certs.add(
      Certificate.new_stake_delegation(
        StakeDelegation.new(
          StakeCredential.from_keyhash(Ed25519KeyHash.from_hex(stakeCredHash)),
          Ed25519KeyHash.from_bech32(poolId)
        )
      )
    );

    txBuilder.set_certs(certs);

    const addressesRelatedToStakeAddress =
      await KoiosService.getAddressesFromStakeAddress(stakeAddress);
    const getAddressesInformation = await KoiosService.getAddressesInformation(
      addressesRelatedToStakeAddress
    );

    const utxosOutput = TransactionUnspentOutputs.new();
    getAddressesInformation.forEach((info) => {
      const utxos = info.utxo_set;
      utxos.forEach((utxo) => {
        const input = TransactionInput.new(
          TransactionHash.from_hex(utxo.tx_hash),
          Number(utxo.tx_index)
        );
        const output = TransactionOutput.new(
          Address.from_bech32(info.address),
          Value.new(BigNum.from_str(utxo.value))
        );
        utxosOutput.add(TransactionUnspentOutput.new(input, output));
      });
    });

    txBuilder.add_inputs_from(utxosOutput, 0);

    txBuilder.add_change_if_needed(Address.from_bech32(delegatorAddress));

    const txBody = txBuilder.build();

    const transaction = Transaction.new(txBody, TransactionWitnessSet.new());

    return {
      witness: transaction.to_hex(),
      txBody: txBody.to_hex(),
    };
  }

  export async function createTxToSubmit(witness: string, txBody: string) {
    const tx = Transaction.new(
      TransactionBody.from_hex(txBody),
      TransactionWitnessSet.from_hex(witness)
    );
    return tx.to_hex();
  }
}
