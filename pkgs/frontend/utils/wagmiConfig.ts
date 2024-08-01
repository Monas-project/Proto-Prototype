import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { createWalletClient, custom, Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonAmoy } from "wagmi/chains";

export const wagmiConfig = (projectId: string) => {
  return getDefaultConfig({
    appName: "Monas",
    projectId,
    chains: [polygonAmoy],
  });
};

export const walletClient = (pushProtocolPrivateKey: Hex) => {
  return createWalletClient({
    chain: polygonAmoy,
    transport: custom(window.ethereum),
    account: privateKeyToAccount(pushProtocolPrivateKey),
  });
};
