# Multi-Chain Reward System

This document describes the multi-chain reward distribution system that supports Stargaze, Intergaze, and MegaETH networks.

## Overview

The multi-chain system allows NFT rewards to be distributed across different blockchain networks while maintaining a unified API and database structure.

### Supported Chains

1. **Stargaze** - CosmWasm-based NFT marketplace
2. **Intergaze** - Initia-based NFT platform
3. **MegaETH** - EVM-based chain (requires additional EVM implementation)

## Architecture

### Database Schema Changes

Added to `trn_distribusi_reward` table:

- `distribusi_chain` - Chain identifier (stargaze, intergaze, megaeth)
- `distribusi_chain_data` - JSON field for chain-specific metadata

### New Components

1. **Chain Configuration** (`lib/chain-config.ts`)

   - Centralized chain configuration management
   - RPC endpoints, gas prices, prefixes per chain

2. **Transfer Service** (`lib/transfer-service.ts`)

   - Multi-chain NFT transfer abstraction
   - Chain-specific transfer implementations

3. **Updated API** (`app/api/soft-staking/claim-reward/route.ts`)
   - Multi-chain aware reward claiming
   - Backward compatibility with existing rewards

## Usage

### API Endpoint

```javascript
POST /api/soft-staking/claim-reward

// Request body
{
  "staker_address": "stars1abc...",
  "chain": "stargaze" // optional, will use reward's chain if not specified
}

// Response
{
  "message": "Claim reward successfully",
  "data": {
    "chain": "stargaze",
    "transactionHash": "ABC123...",
    "chainData": {
      "senderAddress": "stars1def...",
      "gasUsed": "150000",
      "gasWanted": "200000"
    }
  }
}
```

### Transfer Scripts

#### Individual Chain Scripts

```bash
# Stargaze transfer
node scripts/transfer-stargaze.js <contractAddress> <recipientAddress> <tokenId> [mnemonic]

# Intergaze transfer
node scripts/transfer-intergaze.js <contractAddress> <recipientAddress> <tokenId> [mnemonic]

# MegaETH transfer (placeholder)
node scripts/transfer-megaeth.js <contractAddress> <recipientAddress> <tokenId> [privateKey]
```

#### Multi-chain Script

```bash
# Single transfer
node scripts/transfer-multichain.js <chain> <contractAddress> <recipientAddress> <tokenId> [credential]

# Batch transfer from JSON file
node scripts/transfer-multichain.js --batch transfers.json
```

#### Batch Transfer JSON Format

```json
[
  {
    "chain": "stargaze",
    "contractAddress": "stars1abc...",
    "recipientAddress": "stars1xyz...",
    "tokenId": "123",
    "credential": "optional mnemonic"
  },
  {
    "chain": "intergaze",
    "contractAddress": "init1abc...",
    "recipientAddress": "init1xyz...",
    "tokenId": "456"
  }
]
```

## Setup

### 1. Environment Variables

Copy `.env.multichain.example` to `.env` and configure:

```bash
# Stargaze
REWARD_WALLET_MNEMONIC=your-stargaze-mnemonic
RPC_URL=https://rpc.stargaze-apis.com

# Intergaze
INTERGAZE_REWARD_WALLET_MNEMONIC=your-intergaze-mnemonic
INTERGAZE_RPC_URL=https://rpc.intergaze-apis.com

# MegaETH (EVM)
MEGAETH_REWARD_WALLET_PRIVATE_KEY=your-megaeth-private-key
MEGAETH_RPC_URL=https://rpc.megaeth.org
```

### 2. Database Migration

Run the schema migration to add chain fields:

```bash
npx prisma migrate dev
```

Migrate existing data:

```bash
node scripts/migrate-chain-data.js --all
```

### 3. Install Dependencies

Make sure CosmJS dependencies are installed:

```bash
npm install @cosmjs/proto-signing @cosmjs/cosmwasm-stargate @cosmjs/stargate
```

For MegaETH (EVM support), install:

```bash
npm install ethers
```

## Chain-Specific Implementation

### Stargaze

- Uses CosmWasm standard `transfer_nft` message
- Requires mnemonic for wallet creation
- Gas price: `0.025ustars`
- Address prefix: `stars`

### Intergaze

- Uses CosmWasm standard `transfer_nft` message
- Requires mnemonic for wallet creation
- Gas price: `0.03l2/fb936ffef4eb4019d82941992cc09ae2788ce7197fcb08cb00c4fe6f5e79184e`
- Address prefix: `init`

### MegaETH

- **Status**: Placeholder implementation
- Requires EVM integration with ethers.js
- Uses ERC-721 `transferFrom` function
- Requires private key instead of mnemonic
- Gas price in Wei (EVM standard)

## MegaETH Implementation Guide

To complete MegaETH support:

1. **Install ethers.js**:

   ```bash
   npm install ethers
   ```

2. **Uncomment implementation** in:

   - `lib/transfer-service.ts` (transferMegaETHNFT method)
   - `scripts/transfer-megaeth.js`

3. **Set environment variables**:

   ```bash
   MEGAETH_REWARD_WALLET_PRIVATE_KEY=0x...
   MEGAETH_RPC_URL=https://rpc.megaeth.org
   ```

4. **ERC-721 Contract ABI** (minimal):
   ```json
   [
     "function transferFrom(address from, address to, uint256 tokenId) external",
     "function ownerOf(uint256 tokenId) external view returns (address)"
   ]
   ```

## Migration Guide

### From Single-Chain to Multi-Chain

1. **Backup database**
2. **Run migration**:
   ```bash
   node scripts/migrate-chain-data.js --migrate
   ```
3. **Verify results**:
   ```bash
   node scripts/migrate-chain-data.js --verify
   ```
4. **Update reward creation** to include chain field

### Creating New Rewards

When creating new rewards, include chain information:

```sql
INSERT INTO trn_distribusi_reward (
  distribusi_collection,
  distribusi_reward,
  distribusi_wallet,
  distribusi_chain,
  distribusi_type
) VALUES (
  1,
  '/m/collection123/token456',
  'stars1recipient...',
  'stargaze',
  'NFT'
);
```

## Testing

### Unit Tests

Test individual chain transfers:

```bash
# Test Stargaze transfer
node scripts/transfer-stargaze.js stars1abc... stars1xyz... 123

# Test Intergaze transfer
node scripts/transfer-intergaze.js init1abc... init1xyz... 456
```

### Integration Tests

Test API with different chains:

```bash
curl -X POST http://localhost:3000/api/soft-staking/claim-reward \
  -H "Content-Type: application/json" \
  -d '{
    "staker_address": "stars1abc...",
    "chain": "stargaze"
  }'
```

## Monitoring

### Chain-Specific Logs

Each chain transfer includes detailed logging:

- Sender address
- Transaction hash
- Gas usage
- Chain-specific metadata

### Error Handling

- Failed transfers are logged with chain context
- Rewards marked as claimed even if transfer fails (configurable)
- Chain-specific error messages preserved in `distribusi_chain_data`

## Troubleshooting

### Common Issues

1. **Missing mnemonic/private key**:

   - Check environment variables
   - Ensure correct format (mnemonic vs private key)

2. **RPC connection errors**:

   - Verify RPC URLs in configuration
   - Check network connectivity

3. **Gas estimation failures**:

   - Verify wallet has sufficient balance
   - Check gas price configuration

4. **Invalid token/contract**:
   - Verify contract address format
   - Check token ownership

### Debug Mode

Enable debug logging:

```bash
DEBUG=transfer* node scripts/transfer-multichain.js
```

## Future Enhancements

1. **Complete MegaETH implementation**
2. **Add more EVM chains**
3. **Implement cross-chain bridges**
4. **Add transaction monitoring**
5. **Implement retry mechanisms**
6. **Add batch processing optimization**

## Contributing

When adding new chains:

1. Update `lib/chain-config.ts` with chain configuration
2. Implement transfer function in `lib/transfer-service.ts`
3. Create chain-specific script in `scripts/`
4. Update this documentation
5. Add tests for new chain

## Support

For issues or questions:

1. Check this documentation
2. Review error logs with chain context
3. Test with individual chain scripts first
4. Verify environment configuration
