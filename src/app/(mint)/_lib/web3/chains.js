export const ETHEREUM_SEPOLIA_CHAIN_ID = "0xaa36a7";
export const LISK_SEPOLIA_CHAIN_ID = "0x106a";
export const BASE_SEPOLIA_CHAIN_ID = "0x14a34";

// TESTNET CHAIN CONFIG
export const SEPOLIA_ETHEREUM_CONFIG = {
  chainId: ETHEREUM_SEPOLIA_CHAIN_ID,
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

export const SEPOLIA_LISK_CONFIG = {
  chainId: LISK_SEPOLIA_CHAIN_ID,
  rpcTarget: "https://lisk-sepolia.drpc.org",
  displayName: "Lisk Sepolia Testnet",
  blockExplorerUrl: "https://sepolia-blockscout.lisk.com",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/lisk-lsk-logo.png",
};

export const SEPOLIA_BASE_CONFIG = {
  chainId: BASE_SEPOLIA_CHAIN_ID,
  rpcTarget: "https://base-sepolia.drpc.org",
  displayName: "Base Sepolia Testnet",
  blockExplorerUrl: "https://base-sepolia.blockscout.com",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://raw.githubusercontent.com/base-org/brand-kit/main/logo/in-product/Base_Network_Logo.svg",
};

// MAINNET CHAIN CONFIG
export const ETHEREUM_MAINNET_CHAIN_ID = "0x1";
export const LISK_MAINNET_CHAIN_ID = "0x46f";
export const BASE_MAINNET_CHAIN_ID = "0x2105";

export const MAINNET_ETHEREUM_CONFIG = {
  chainId: ETHEREUM_MAINNET_CHAIN_ID,
  rpcTarget: "https://eth.drpc.org",
  displayName: "Ethereum",
  blockExplorerUrl: "https://etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

export const MAINNET_LISK_CONFIG = {
  chainId: LISK_MAINNET_CHAIN_ID,
  rpcTarget: "https://lisk.drpc.org",
  displayName: "Lisk",
  blockExplorerUrl: "https://blockscout.lisk.com",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/lisk-lsk-logo.png",
};

export const MAINNET_BASE_CONFIG = {
  chainId: BASE_MAINNET_CHAIN_ID,
  rpcTarget: "https://base.drpc.org",
  displayName: "Base",
  blockExplorerUrl: "https://basescan.org",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://raw.githubusercontent.com/base-org/brand-kit/main/logo/in-product/Base_Network_Logo.svg",
};

export const CHAIN_CONFIGS =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === "development"
    ? [SEPOLIA_LISK_CONFIG, SEPOLIA_ETHEREUM_CONFIG, SEPOLIA_BASE_CONFIG]
    : [MAINNET_LISK_CONFIG, MAINNET_ETHEREUM_CONFIG, MAINNET_BASE_CONFIG];

export const AVAILABLE_CHAIN_LIST =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === "development"
    ? [
        // {
        //   id: "ethereum",
        //   chainId: ETHEREUM_SEPOLIA_CHAIN_ID,
        //   name: "Ethereum",
        //   logoUrl: "/assets/dashboard/mint-page/account-bar/eth-chain-logo.png",
        // },
        {
          id: "lisk",
          chainId: LISK_SEPOLIA_CHAIN_ID,
          name: "Lisk",
          logoUrl:
            "/assets/dashboard/mint-page/account-bar/lisk-chain-logo.png",
        },
        // {
        //   id: "base",
        //   chainId: BASE_SEPOLIA_CHAIN_ID,
        //   name: "Base",
        //   logoUrl:
        //     "/assets/dashboard/mint-page/account-bar/base-chain-logo.png",
        // },
      ]
    : [
        // {
        //   id: "ethereum",
        //   chainId: ETHEREUM_MAINNET_CHAIN_ID,
        //   name: "Ethereum",
        //   logoUrl: "/assets/dashboard/mint-page/account-bar/eth-chain-logo.png",
        // },
        {
          id: "lisk",
          chainId: LISK_MAINNET_CHAIN_ID,
          name: "Lisk",
          logoUrl:
            "/assets/dashboard/mint-page/account-bar/lisk-chain-logo.png",
        },
        //   {
        //     id: "base",
        //     chainId: BASE_MAINNET_CHAIN_ID,
        //     name: "Base",
        //     logoUrl:
        //       "/assets/dashboard/mint-page/account-bar/base-chain-logo.png",
        //   },
      ];

// TODO: Support multichain contract
export const DEFAULT_CHAIN_CONFIG =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === "development"
    ? SEPOLIA_LISK_CONFIG
    : MAINNET_LISK_CONFIG;
