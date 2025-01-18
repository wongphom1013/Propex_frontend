"use client";

import { ThirdwebProvider } from "thirdweb/react";
import Web3EventProvider from "./Web3EventProvider";

export default function ThirdWebProvider(props) {
  return (
    <ThirdwebProvider>
      <Web3EventProvider>{props.children}</Web3EventProvider>
    </ThirdwebProvider>
  );
}
