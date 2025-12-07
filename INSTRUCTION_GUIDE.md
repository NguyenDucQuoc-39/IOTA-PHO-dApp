# Pho Restaurant

Complete guide for deploying and customizing your IOTA dApp with authentic Pho cooking simulation.

## 📍 Contract Address

**Network**: Devnet
**Package ID**: `0x07f7d000c0edd43232395a19b38425d7ec1bcc9b929b3b7ad6ad0d694b441116`
**Explorer**: [View on Explorer](https://explorer.devnet.iota.org/object/0x07f7d000c0edd43232395a19b38425d7ec1bcc9b929b3b7ad6ad0d694b441116)

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 📝 Next Steps

### 1. Deploy Your Move Contract

**Option A: Automated Deployment (Recommended)**

```bash
npm run iota-deploy
```

This script will:
- ✅ Check if IOTA CLI is installed
- ✅ Set up testnet environment
- ✅ Create an account if needed
- ✅ Request gas from faucet
- ✅ Build your Move contract
- ✅ Publish the contract
- ✅ **Automatically update `lib/config.ts` with the package ID**

**Option B: Manual Deployment**

```bash
cd contract/pho_restaurant
iota move build
iota client publish --gas-budget 100000000 pho_restaurant
```

Then manually copy the package ID and update `lib/config.ts`:

```typescript
export const DEVNET_PACKAGE_ID = "0xYOUR_PACKAGE_ID"
```

### 2. Customize Your Contract

The contract module is located at:
- **Move Contract**: `contract/pho_restaurant/sources/pho_restaurant.move`
- **Module**: `pizza_box::pho`
- **Methods**: `cook_pho`, `get_perfect_pho_flag`

### 3. Customize the UI

Edit `components/sample.tsx` to match your dApp's design.

## 🍲 Perfect Pho Recipe Challenge

To earn the Perfect Pho flag, cook with these exact values:

```
Broth Quality:    10
Noodle Thickness: 2
Beef Brisket:     70
Basil:            30
Cilantro:         25
Mint:             15
Star Anise:       2
Cinnamon:         1
```

## 📁 Project Structure

```
├── app/              # Next.js app directory
│   ├── layout.tsx    # Root layout with providers
│   └── page.tsx      # Main page
├── components/       # React components
│   ├── Provider.tsx  # IOTA providers wrapper
│   ├── sample.tsx    # Main dApp integration
│   └── Wallet-connect.tsx  # Wallet button
├── hooks/            # Custom hooks
│   └── useContract.ts  # Contract logic
├── lib/              # Configuration
│   └── config.ts     # Network & package IDs
└── contract/         # Move contracts
    └── pho_restaurant/  # Your Move contract
```

## 🔧 Advanced Configuration

For more advanced configuration options, check the Next.js and IOTA documentation.

## 📞 Support

For issues and questions, please refer to:
- [IOTA Documentation](https://wiki.iota.org/)
- [IOTA dApp Kit GitHub](https://github.com/iotaledger/dapp-kit)
- [Next.js Documentation](https://nextjs.org/docs)
