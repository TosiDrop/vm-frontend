import { bech32 } from 'bech32';
import { Buffer } from 'buffer';

export function getStakingAddressFromAddress(address: string): { staking_address: string } {
    // decode bech32 shelley address and convert to hex 
    const addressWords = bech32.decode(address, 1000);
    const payload = bech32.fromWords(addressWords.words);
    const addressDecoded = `${Buffer.from(payload).toString('hex')}`;

    // stake part of the address is the last 56 bytes + e0 testnet or e1 mainnet https://hydra.iohk.io/build/7918420/download/1/ledger-spec.pdf
    const stakeAddressDecoded = 'e1' + addressDecoded.substring(addressDecoded.length - 56);

    // convert to bech32 to get stake address
    const stakeAddress = bech32.encode(
        'stake',
        bech32.toWords(Uint8Array.from(Buffer.from(stakeAddressDecoded, 'hex'))),
        1000
    );
    return { staking_address: stakeAddress };
}