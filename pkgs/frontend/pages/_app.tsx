import { GlobalProvider } from "@/context/GlobalProvider";
import { getEnv } from "@/utils/getEnv";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { useEffect, useMemo, useState } from "react";
import { WagmiProvider } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import "../styles/globals.css";
import { ResponseData } from "./api/env";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DarkMode from "@/components/layouts/DarkMode/DarkMode";
import { wagmiConfig } from "@/utils/wagmiConfig";

/**
 * MyApp Component
 * @param param0
 * @returns
 */
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const [env, setEnv] = useState<ResponseData>();

  const config: any = useMemo(
    () => env && wagmiConfig(env.WALLET_CONNECT_PROJECT_ID),
    [env]
  );

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
        <WagmiProvider config={config} reconnectOnMount={true}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
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
                  "https://github.com/Monas-project/Proto-Prototype",
              }}
            >
              <GlobalProvider>
                <DarkMode>
                  <Component {...pageProps} />
                </DarkMode>
              </GlobalProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      )}
    </>
  );
}

export default MyApp;
