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
  TransactionUnspentOutputs,
  TransactionWitnessSet,
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

    /** add delegation certs */
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

    /** assemble utxos from stake address */
    const addressesRelatedToStakeAddress =
      await KoiosService.getAddressesFromStakeAddress(stakeAddress);
    const addressesInformation = await KoiosService.getAddressesInformation(
      addressesRelatedToStakeAddress
    );
    const availableUtxos = TransactionUnspentOutputs.new();
    addressesInformation.forEach((info) => {
      const utxos = info.utxo_set;
      utxos.forEach((utxo) => {
        const availableUtxo = CardanoService.createUtxo(utxo, info.address);
        availableUtxos.add(availableUtxo);
      });
    });

    txBuilder.add_inputs_from(availableUtxos, 0);
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
