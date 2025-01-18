import { customAlphabet } from "nanoid";

export function shortenAddress(walletAddress, startChars = 5, endChars = 4) {
  if (!walletAddress) return "";

  const startPart = walletAddress.slice(0, startChars);
  const endPart = walletAddress.slice(-endChars);
  return `${startPart}...${endPart}`;
}

export const generateNonce = (length = 12) => {
  const nonceGenerator = customAlphabet(
    "abcdefghijklmnopqrstuvwxyz0123456789",
    length
  );
  return nonceGenerator();
};
