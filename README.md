# Pixel8r

Pixel8r is a decentralized NFT platform built with **Next.js**, **Solidity**, and modern web technologies, empowering users to create **pixel art NFTs**, list them on a marketplace, and manage collections with **blockchain transparency**.

What sets **Pixel8r** apart? It makes **digital art copyright-proof**. By subtly altering each pixel’s composition, the platform ensures that **every artwork is one-of-a-kind and immune to copyright claims**. Your creations remain **unique, secure, and truly yours** — down to the last pixel.

Additionally, Pixel8r integrates an **AI-powered NFT expert**, built using **io.net**, to assist users throughout the platform. The AI agent provides **personalized guidance** on creating, listing, and managing NFTs, helping users navigate the **NFT landscape** efficiently. Whether you're a beginner or an experienced creator, the **AI expert** ensures you make the most of your digital art journey on Pixel8r.

## Live Demo: https://pixel8r2.vercel.app

<img width="1872" height="921" alt="image" src="https://github.com/user-attachments/assets/f08820f1-9798-451b-b46c-c47bf999a10e" />

<img width="1873" height="929" alt="image" src="https://github.com/user-attachments/assets/2d09366f-d962-40cc-a138-273d4eb9dfaa" />

<img width="1872" height="919" alt="image" src="https://github.com/user-attachments/assets/a2b5ec23-7ff0-4aa0-a777-f1a74589744c" />

<img width="1876" height="923" alt="image" src="https://github.com/user-attachments/assets/c3095ed0-ac33-4dcc-8818-464c4029f1a3" />

<img width="1871" height="925" alt="image" src="https://github.com/user-attachments/assets/af673aba-1fe2-4226-a788-fa64d14ee4f3" />

## Features
- **NFT Maker**: Create unique pixel art NFTs directly from the platform.
- **Marketplace**: Browse, buy, and sell NFTs in a decentralized marketplace.
- **Deploy NFT** Suggestor: Upload your NFT artwork and let AI suggest a title, description, and estimated price based on image analysis.
- **NFT-AI**: Smart AI agent powered by IO.NET
- **My Collection**: Manage your NFT collection in one place.
- **Pixelate Tool**: Convert images into pixel art directly on the platform.
- **Profile Management**: Customize your profile and view transaction history.
- **Blockchain Integration**: Smart contracts deployed on the Polygon blockchain.

## AI Integration with IO Intelligence

Pixel8r features two powerful AI models from io.net’s IO Intelligence to enhance the user experience:

meta-llama/Llama-3.2-90B-Vision-Instruct: Powers the Deploy NFT Suggestor, analyzing uploaded artwork and generating an ideal title, description, and estimated price based on visual content.

meta-llama/Llama-3.3-70B-Instruct: Fuels the NFT-AI Assistant, providing real-time help, guidance, and answers related to NFTs, wallet setup, deployment, and marketplace strategies.

These models ensure both visual intelligence and language expertise work together to support users in creating, managing, and optimizing their NFT journey.

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
npm install --legacy--peer-deps
```

### Step 3: Set Up Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
IO_INTELLIGENCE_API_KEY=your_api_key
IO_MODEL_ID=any_model_name
```

### Step 4: Run the Development Server
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

