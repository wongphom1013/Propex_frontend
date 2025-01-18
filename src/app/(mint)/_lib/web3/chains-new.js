import { defineChain } from "thirdweb";

export const THIRDWEB_LISK_CHAIN = defineChain({
  rpc: "https://lisk.drpc.org",
  blockExplorers: "https://blockscout.lisk.com",
  name: "Lisk",
  icon: "https://cryptologos.cc/logos/lisk-lsk-logo.png",
  testnet: false,
  id: 1135,
  chainId: 1135,
});
