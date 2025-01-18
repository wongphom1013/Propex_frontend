import { getRaribleChainName } from "@/config";

export const createRaribleLink = (chainId, contractAddress, tokenId) => {
  return `https://rarible.com/token/${getRaribleChainName(
    chainId
  )}/${contractAddress}:${tokenId}`;
};
