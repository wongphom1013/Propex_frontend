import {
  BASE_MAINNET_CHAIN_ID,
  BASE_SEPOLIA_CHAIN_ID,
  ETHEREUM_MAINNET_CHAIN_ID,
  ETHEREUM_SEPOLIA_CHAIN_ID,
  LISK_MAINNET_CHAIN_ID,
  LISK_SEPOLIA_CHAIN_ID,
  MAINNET_BASE_CONFIG,
  MAINNET_ETHEREUM_CONFIG,
  MAINNET_LISK_CONFIG,
  SEPOLIA_BASE_CONFIG,
  SEPOLIA_ETHEREUM_CONFIG,
  SEPOLIA_LISK_CONFIG,
} from "./chains";

// Your utility function goes here
export const createTransactionUrl = (transactionHash, chainId) => {
  const isDev = process.env.NEXT_PUBLIC_DEPLOY_ENV === "development";

  let config;

  if (isDev) {
    switch (chainId) {
      case ETHEREUM_SEPOLIA_CHAIN_ID:
        config = SEPOLIA_ETHEREUM_CONFIG;
        break;
      case LISK_SEPOLIA_CHAIN_ID:
        config = SEPOLIA_LISK_CONFIG;
        break;
      case BASE_SEPOLIA_CHAIN_ID:
        config = SEPOLIA_BASE_CONFIG;
        break;
      default:
        return null;
    }
  } else {
    switch (chainId) {
      case ETHEREUM_MAINNET_CHAIN_ID:
        config = MAINNET_ETHEREUM_CONFIG;
        break;
      case LISK_MAINNET_CHAIN_ID:
        config = MAINNET_LISK_CONFIG;
        break;
      case BASE_MAINNET_CHAIN_ID:
        config = MAINNET_BASE_CONFIG;
        break;
      default:
        return null;
    }
  }

  return `${config.blockExplorerUrl}/tx/${transactionHash}`;
};
