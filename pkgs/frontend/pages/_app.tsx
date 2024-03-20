import { getEnv } from "@/utils/getEnv";
import {
<<<<<<< HEAD
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { filecoinCalibration } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import "../styles/globals.css";
import { ResponseData } from "./api/env";
=======
  filecoinCalibration
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import '../styles/globals.css';

const {
  chains,
  publicClient,
  webSocketPublicClient
} = configureChains(
  [
    filecoinCalibration,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [filecoinCalibration] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Monas',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains,
});

const wagmiConfig = createConfig({
  // autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});
>>>>>>> 30f3b97 (Add UI)

/**
 * MyApp Component
 * @param param0
 * @returns
 */
function MyApp({ Component, pageProps }: AppProps) {
<<<<<<< HEAD
  const [env, setEnv] = useState<ResponseData>();

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
      filecoinCalibration,
      ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
        ? [filecoinCalibration]
        : []),
    ],
    [publicProvider()]
  );

  let wagmiConfig: any;

  if (env != undefined) {
    const { connectors } = getDefaultWallets({
      appName: "Monas",
      projectId: env.WALLET_CONNECT_PROJECT_ID!,
      chains,
    });
    wagmiConfig = createConfig({
      // autoConnect: true,
      connectors,
      publicClient,
      webSocketPublicClient,
    });
  }

  useEffect(() => {
    const init = async () => {
      // get enviroment values
      const envData = await getEnv();
      setEnv(envData);
    };
    init();
  }, []);

  return (
    <>
      {env != undefined && (
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            coolMode={true}
            locale="en"
            showRecentTransactions={true}
            theme={darkTheme({
              accentColor: "rgb(54 44 73 / var(--tw-bg-opacity)",
              accentColorForeground: "white",
              borderRadius: "medium",
              fontStack: "rounded",
              overlayBlur: "large",
            })}
            appInfo={{
              appName: "Monas",
              learnMoreUrl:
                "https://github.com/Monas-project/Filecoin-Data-Economy-Hackathon",
            }}
          >
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      )}
    </>
=======

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        coolMode={true}
        locale='en'
        showRecentTransactions={true}
        theme={darkTheme({
          accentColor: 'rgb(54 44 73 / var(--tw-bg-opacity)',
          accentColorForeground: 'white',
          borderRadius: 'medium',
          fontStack: 'rounded',
          overlayBlur: 'large',
        })}
        appInfo={{
          appName: 'Monas',
          learnMoreUrl: 'https://github.com/Monas-project/Filecoin-Data-Economy-Hackathon',
        }}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
>>>>>>> 30f3b97 (Add UI)
  );
}

export default MyApp;
