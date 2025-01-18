import { privateKeyToAccount } from "thirdweb/wallets";
import {
  createWalletClient,
  createPublicClient,
  custom,
  formatEther,
  parseEther,
} from "viem";
import { mainnet, polygonAmoy, sepolia } from "viem/chains";

const getViewChain = (provider) => {
  switch (provider.chainId) {
    case "1":
      return mainnet;
    case "0x13882":
      return polygonAmoy;
    case "0xaa36a7":
      return sepolia;
    default:
      return mainnet;
  }
};

const createLocalAccountClient = (privateKey, provider) => {
  const account = privateKeyToAccount(privateKey);
  const walletClient = createWalletClient({
    account,
    chain: getViewChain(provider),
  });
  return walletClient;
};

const getChainId = async (provider, isDemoMode = false) => {
  try {
    let walletClient;
    if (isDemoMode) {
      const demoPK = process.env.DEMO_WALLET_PK;
      walletClient = createLocalAccountClient(demoPK, provider);
    } else {
      walletClient = createWalletClient({
        transport: custom(provider),
      });
    }

    const address = await walletClient.getAddresses();
    console.log(address);

    const chainId = await walletClient.getChainId();
    return chainId.toString();
  } catch (error) {
    return error;
  }
};
const getAccounts = async (provider, isDemoMode = false) => {
  try {
    let walletClient;
    if (isDemoMode) {
      const demoPK = process.env.DEMO_WALLET_PK;
      walletClient = createLocalAccountClient(demoPK, provider);
    } else {
      walletClient = createWalletClient({
        chain: getViewChain(provider),
        transport: custom(provider),
      });
    }

    const address = await walletClient.getAddresses();

    return address;
  } catch (error) {
    return error;
  }
};

const getBalance = async (provider, isDemoMode = false) => {
  try {
    let walletClient;
    const publicClient = createPublicClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    });
    if (isDemoMode) {
      const demoPK = process.env.DEMO_WALLET_PK;
      walletClient = createLocalAccountClient(demoPK, provider);
    } else {
      walletClient = createWalletClient({
        chain: getViewChain(provider),
        transport: custom(provider),
      });
    }

    const address = await walletClient.getAddresses();

    const balance = await publicClient.getBalance({ address: address[0] });
    console.log(balance);
    return formatEther(balance);
  } catch (error) {
    return error;
  }
};

const sendTransaction = async (provider, isDemoMode = false) => {
  try {
    let walletClient;
    const publicClient = createPublicClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    });

    if (isDemoMode) {
      const demoPK = process.env.DEMO_WALLET_PK;
      walletClient = createLocalAccountClient(demoPK, provider);
    } else {
      walletClient = createWalletClient({
        chain: getViewChain(provider),
        transport: custom(provider),
      });
    }

    // data for the transaction
    const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";
    const amount = parseEther("0.0001");
    const address = await walletClient.getAddresses();

    // Submit transaction to the blockchain
    const hash = await walletClient.sendTransaction({
      account: address[0],
      to: destination,
      value: amount,
    });
    console.log(hash);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    return JSON.stringify(
      receipt,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    );
  } catch (error) {
    return error;
  }
};

const signMessage = async (provider, isDemoMode = false) => {
  try {
    let walletClient;
    if (isDemoMode) {
      const demoPK = process.env.DEMO_WALLET_PK;
      walletClient = createLocalAccountClient(demoPK, provider);
    } else {
      walletClient = createWalletClient({
        chain: getViewChain(provider),
        transport: custom(provider),
      });
    }

    // data for signing
    const address = await walletClient.getAddresses();
    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const hash = await walletClient.signMessage({
      account: address[0],
      message: originalMessage,
    });

    console.log(hash);

    return hash.toString();
  } catch (error) {
    return error;
  }
};

const viemUtils = {
  getChainId,
  getAccounts,
  getBalance,
  sendTransaction,
  signMessage,
};

export default viemUtils;
