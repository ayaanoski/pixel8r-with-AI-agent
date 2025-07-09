# Pixel8r

Pixel8r is a decentralized NFT platform built with **Next.js**, **Solidity**, and modern web technologies, empowering users to create **pixel art NFTs**, list them on a marketplace, and manage collections with **blockchain transparency**.

What sets **Pixel8r** apart? It makes **digital art copyright-proof**. By subtly altering each pixel’s composition, the platform ensures that **every artwork is one-of-a-kind and immune to copyright claims**. Your creations remain **unique, secure, and truly yours** — down to the last pixel.

Additionally, Pixel8r integrates an **AI-powered NFT expert**, built using **io.net**, to assist users throughout the platform. The AI agent provides **personalized guidance** on creating, listing, and managing NFTs, helping users navigate the **NFT landscape** efficiently. Whether you're a beginner or an experienced creator, the **AI expert** ensures you make the most of your digital art journey on Pixel8r.

## Live Demo: https://pixel8r2.vercel.app

![image](https://github.com/user-attachments/assets/31c5dab5-e5ae-4890-a0a9-0ad75bf0b948)

![image](https://github.com/user-attachments/assets/509d901a-b9a6-4bef-a374-54de50af0ffc)

![image](https://github.com/user-attachments/assets/70521862-c9e3-46ae-a67d-3e44a5d96e94)

![image](https://github.com/user-attachments/assets/6283b546-f973-4108-8bbe-e9d52b0d215e)



## Features
- **NFT Maker**: Create unique pixel art NFTs directly from the platform.
- **Marketplace**: Browse, buy, and sell NFTs in a decentralized marketplace.
- **NFT-AI**: Smart AI agent powered by IO.NET
- **My Collection**: Manage your NFT collection in one place.
- **Pixelate Tool**: Convert images into pixel art directly on the platform.
- **Profile Management**: Customize your profile and view transaction history.
- **Blockchain Integration**: Smart contracts deployed on the Polygon blockchain.

## Tech Stack
- **Next.js** for frontend development
- **Tailwind CSS** for styling
- **TypeScript** for type-safe development
- **Solidity** for smart contract development
- **Truffle** for smart contract management
- **React Hooks** for state management

---

## Directory Structure
```
ayaandoski-pixel8r/
├── app/
│   ├── components/
│   ├── history/
│   ├── marketplace/
│   ├── my-collection/
│   ├── nft-maker/
│   ├── pixelate/
│   └── profile/
├── components/
│   └── ui/
├── contracts/
├── hooks/
├── lib/
├── migrations/
├── public/
│   └── assets/
├── styles/
└── test/
```

## Getting Started
### Prerequisites
Ensure you have the following installed:
- Node.js (v16+)
- npm or yarn
- Truffle
- MetaMask extension for browser

### Step 1: Clone the Repository
```bash
git clone https://github.com/ayaanoski/pixel8r.git
cd pixel8r
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key
NEXT_PUBLIC_WALLET_ADDRESS=your_wallet_address
IO_INTELLIGENCE_API_KEY=your_api_key
IO_MODEL_ID=any_model_name
```

### Step 4: Compile and Deploy Smart Contracts
Navigate to the `contracts` directory and deploy the smart contracts using Truffle.
```bash
truffle compile
truffle migrate --network your_network_name
```

### Step 5: Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 6: Connect Wallet
- Ensure your MetaMask wallet is connected to the same network as your deployed contracts.

### Step 7: Create NFTs
- Navigate to the NFT Maker section and create your first NFT.

### Step 8: Explore the Marketplace
- List your NFTs on the marketplace and explore other collections.

---

## Smart Contract Details
The main contract is `PixelNFT.sol` located in the `contracts/` directory. This contract handles the minting, transferring, and marketplace functionality for NFTs.

## Components
Reusable UI components are in the `components/ui/` directory, such as:
- `Button`
- `Card`
- `Toast`
- `Accordion`
- `Avatar`

## Hooks
Custom hooks like `useToast` and `useMobile` are located in the `hooks/` directory.

---

## Contributing
1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

---

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

---

## Contact
For any inquiries, please contact:
- **GitHub**: [Ayaan Adil](https://github.com/ayaanoski)
- **LinkedIn**: [Ayaan Adil](https://www.linkedin.com/in/ayaan-adil-371137268/)

