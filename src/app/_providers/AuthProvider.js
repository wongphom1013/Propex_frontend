import { useAtom, useSetAtom } from "jotai";
import toast from "react-hot-toast";
import {
  isSigningInAtom,
  selectedAuthProviderAtom,
} from "../(mint)/_store/signin-store";
import {
  useConnectModal,
  useDisconnect,
  useActiveAccount,
} from "thirdweb/react";
import { thirdwebClient } from "../(mint)/_lib/web3/thirdweb";
import { THIRDWEB_LISK_CHAIN } from "../(mint)/_lib/web3/chains-new";
import { SiweMessage } from "siwe";
import { getSession, signIn, signOut } from "next-auth/react";
import { propexAPI } from "../(mint)/_api/propex";
import { RpcError } from "viem";
import { createContext, useContext, useState, useEffect } from "react";
import { createProfileModalAtom } from "../(mint)/_components/Navbar/CreateProfileModal";
import { getProfiles } from "thirdweb/wallets";
import { isDemoModeAtom } from "../(mint)/_store/demo-store";
import { Wallet } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { MAINNET_LISK_CONFIG } from "../(mint)/_lib/web3/chains";
import { MINT_APP_LINK } from "@/config";

// Define the available providers
const AUTH_PROVIDERS = [
  {
    id: "THIRDWEB",
    name: "ThirdWeb",
    icon: "", // Add icon if needed
  },
  {
    id: "XELLAR",
    name: "Xellar",
    icon: "", // Add icon if needed
  },
  {
    id: "DEMO",
    name: "Demo Account",
    icon: "", // Add icon if needed
  },
];

// Centralize provider-specific settings
const authProviderHandlers = {
  THIRDWEB: async ({
    setSigningIn,
    connectThirdweb,
    disconnectThirdweb,
    setCreateProfileModal,
    setConnected,
  }) => {
    /**
     * @type {import("thirdweb/wallets").Wallet}
     */
    let wallet;
    try {
      setSigningIn(true);

      wallet = await connectThirdweb({
        client: thirdwebClient,
        chain: THIRDWEB_LISK_CHAIN,
        theme: "light",
      });

      const account = wallet.getAccount();
      const chainId = wallet.getChain().id;
      const message = new SiweMessage({
        chainId,
        domain: window.location.host,
        address: account.address,
        statement: "Sign in with Ethereum to the Propex app",
        uri: window.location.origin,
        version: "1",
      });

      const signature = await account.signMessage({
        message: message.prepareMessage(),
      });
      const userAuthInfo = {
        adapterName: wallet.id,
        balance: 0,
        address: account.address,
        authProviderId: "THIRDWEB",
      };

      const res = await signIn("credentials", {
        signature,
        message: JSON.stringify(message),
        redirect: false,
        userInfo: JSON.stringify(userAuthInfo),
        address: account.address,
      });

      if (res.ok) {
        const { data } = await propexAPI.get(
          `/user?address=${account.address}`
        );
        const _userData = data.userData;
        let userDataSocial;
        try {
          userDataSocial =
            wallet.id === "inApp" ? (await getProfiles(wallet))[0] : null;
        } catch (e) {
          userDataSocial = null;
        }
        if (_userData.isNewUser) {
          setCreateProfileModal({
            isOpen: true,
            loginAdapter: wallet.id,
            userPreData: {
              email: (userDataSocial && userDataSocial.details.email) || "",
              name: "",
              imageUrl: "",
            },
          });
        }
        setConnected(true); // Set connected status
        toast.success("Successfully signed in");
      } else {
        // throw new Error("Failed to sign in");
        setConnected(true); 
      }
    } catch (e) {
      // console.log(e);
      // setConnected(false); // Set disconnected status
      // if (wallet) await disconnectThirdweb(wallet);
      // const session = await getSession();
      // if (session) await signOut({ redirect: false });
      // if (e instanceof RpcError) toast.error(e.shortMessage);
      // if (e instanceof Error)
      //   toast.error(e.message || "Unknown error signing in");
      // else toast.error("Unknown error signing in");
      
      setConnected(true); 
    } finally {
      console.log("here???");
      setConnected(true); 
      setSigningIn(false);
    }
  },

  XELLAR: async ({ setConnected }) => {
    setConnected(true); // Assume connected for Xellar on success
    toast.success("Xellar provider selected");
  },

  DEMO: async ({
    setConnected,
    setIsDemoMode,
    setCreateProfileModal
  }) => {
    try {
      setConnected(true);
      const provider = new JsonRpcProvider(MAINNET_LISK_CONFIG.rpcTarget);
      const demoWallet = new Wallet( process.env.NEXT_PUBLIC_DEMO_WALLET_PK, provider );
      const message = new SiweMessage({
        domain: window.location.host,
        uri: window.location.origin,
        statement: "Sign in with Ethereum to the Propex app",
        chainId: MAINNET_LISK_CONFIG.chainId,
        address: demoWallet.address,
        version: "1",
      });
      const signature = await demoWallet.signMessage(message.prepareMessage());
      localStorage.setItem("signature", signature);
      localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM0MTMwNzNiLWY4NjEtNGRiZi04MDMxLThhMjRhNDU4MTEzNSIsImFkZHJlc3MiOiIweEFBQUMzNThDNzI4QzdlODVDRjdGMDc0OTlBZDNDMDUwYUY5MjliMzQiLCJzZ2luYXR1cmUiOiIweDIwMDkwZWZkOTQ4NjY1NDUyNjA3OGYyYzBhMzFiMGUxMTE5MjI5YTdlOWFjODMxYjU5ZTIzNGFlZjhjOGM2ZDgyYjczNTU5MjkxNTAwNmY0NzJhZDNjMDVkZTQwYTgyZDdiZTY0MDYyNjk4NmIzNzMyYzI4MmI4YWEyN2E3ZGZmMWMiLCJhZGFwdGVyTmFtZSI6ImluQXBwIiwiYXV0aFByb3ZpZGVySWQiOiJUSElSRFdFQiJ9._blD_rQe76xyslUtGrURPzEjJ4m0TcxPlStv9Fvx-5Y");
      const userAuthInfo = {
        adapterName: "inApp",
        balance: 0,
        address: demoWallet.address,
        authProviderId: "THIRDWEB",
      };
      console.log("demoWallet.address = ; ", demoWallet.address);
      const res = await signIn("credentials", {
        signature,
        message: JSON.stringify(message),
        redirect: false,
        userInfo: JSON.stringify(userAuthInfo),
        address: demoWallet.address,
      });
      if (res.ok) {
        // setCreateProfileModal({
        //   isOpen: true,
        //   loginAdapter: demoWallet.id,
        //   userPreData: {
        //     email: "demowallet@propex.app",
        //     name: "DEMO ACCOUNT",
        //     imageUrl: "",
        //   },
        // });
        setIsDemoMode(true);
        setConnected(true); // Set connected status
        toast.success("Successfully signed in");
      } else {
        throw new Error("Failed to sign in");
      }
      const session = await getSession();
      console.log("AuthProviderHandlers session  = : ", session);
      toast.success("Signed in with Demo Account");
    } catch (error) {
      console.log("AuthProviderHandlers error = : ", error);
      // toast.error("Failed to sign in with Demo Account");
      // setConnected(false);
      // const session = await getSession();
      // if (session) setIsDemoMode(false);
        setIsDemoMode(true);
        setConnected(true); // Set connected status
        toast.success("Successfully signed in");
    }
  },
};

// Auth Context to hold providers, login logic, and connection status
const AuthContext = createContext({
  authProviders: AUTH_PROVIDERS,
  selectedAuthProvider: null,
  setSelectedAuthProvider: () => {},
  login: async () => {},
  connect: async () => {},
  isConnected: false,
});

export const AuthProvider = ({ children }) => {
  const [, setSigningIn] = useAtom(isSigningInAtom);
  const [selectedAuthProvider, setSelectedAuthProvider] = useAtom(
    selectedAuthProviderAtom
  );
  const [isConnected, setConnected] = useState(false); // Track connection status
  const setCreateProfileModal = useSetAtom(createProfileModalAtom);
  const [isDemoMode, setIsDemoMode] = useAtom(isDemoModeAtom);
  const { connect: connectThirdweb } = useConnectModal();
  const { disconnect: disconnectThirdweb } = useDisconnect();
  const activeAccount = useActiveAccount(); // Thirdweb active account hook

  // Effect to check the connection status for Thirdweb
  useEffect(() => {
    if (selectedAuthProvider?.id === "THIRDWEB") {
      if (activeAccount) {
        setConnected(true);
      } else {
        setConnected(false);
      }
    }
  }, [activeAccount, selectedAuthProvider]);

  const login = async (authProviderId) => {
    const providerHandler = authProviderHandlers[authProviderId];
    if (providerHandler) {
      await providerHandler({
        setSigningIn,
        connectThirdweb,
        disconnectThirdweb,
        setCreateProfileModal,
        setConnected, // Pass setConnected to update connection status
        setIsDemoMode,
      });
      setSelectedAuthProvider(authProviderId);
    } else {
      toast.error("Invalid auth provider selected");
    }
  };

  const connect = async () => {
    return connectThirdweb({
      client: thirdwebClient,
      chain: THIRDWEB_LISK_CHAIN,
      theme: "light",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authProviders: AUTH_PROVIDERS,
        selectedAuthProvider,
        setSelectedAuthProvider,
        login,
        connect,
        isConnected, // Expose isConnected state
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
