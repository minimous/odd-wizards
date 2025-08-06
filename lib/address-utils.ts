import { fromBech32, toBech32 } from '@cosmjs/encoding';

export const AddressUtils = {
  /**
   * Convert hex address to bech32 format
   */
  toBech32(hexAddress: string, prefix: string = 'init'): string {
    // Remove 0x prefix if present
    let cleanHex = hexAddress.startsWith('0x')
      ? hexAddress.slice(2)
      : hexAddress;

    // Validate hex address length (should be 40 characters for 20 bytes)
    if (cleanHex.length !== 40) {
      throw new Error(
        `Invalid hex address length: ${cleanHex.length}, expected 40`
      );
    }

    // Convert hex string to bytes
    const addressBytes = Buffer.from(cleanHex, 'hex');

    // Convert to bech32
    return toBech32(prefix, addressBytes);
  },

  /**
   * Convert bech32 address to ETH hex format
   */
  toEthAddress(bech32Address: string): string {
    const { data } = fromBech32(bech32Address);
    return '0x' + Buffer.from(data).toString('hex');
  },

  /**
   * Convert address to bytes
   */
  toBytes(address: string): Uint8Array {
    if (address.startsWith('0x')) {
      // Handle hex address
      const cleanHex = address.slice(2);
      return new Uint8Array(Buffer.from(cleanHex, 'hex'));
    } else {
      // Handle bech32 address
      const { data } = fromBech32(address);
      return data;
    }
  }
};
