/**
 * @type {import("thirdweb/dist/types/chains/types").ChainOptions}
 */
export const LISK_MAINNET_CHAIN_CONFIG = {
  rpc: "https://lisk.drpc.org",
  displayName: "Lisk",
  blockExplorers: "https://blockscout.lisk.com",
  ticker: "ETH",
  tickerName: "Ethereum",
  icon: "https://cryptologos.cc/logos/lisk-lsk-logo.png",
};

/**
 * @type {import("thirdweb/dist/types/chains/types").ChainOptions}
 */
export const SEPOLIA_CHAIN_CONFIG = {
  rpc: "https://lisk.drpc.org",
  name: "Ethereum Sepolia Testnet",
  blockExplorers: "https://sepolia.etherscan.io",
  icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};
