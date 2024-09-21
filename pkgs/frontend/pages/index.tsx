import Loading from "@/components/loading";
import { GlobalContext } from "@/context/GlobalProvider";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useAccount, useConfig, useSignMessage } from "wagmi";
import { ResponseData } from "./api/env";
import { useSignUp } from "@/hooks/cryptree/useSignUp";
import { useLogin } from "@/hooks/cryptree/useLogin";

export default function Login({ env }: { env: ResponseData }) {
  const [routePushed, setRoutePushed] = useState(false);
  const config = useConfig();
  const account = useAccount({ config });
  const router = useRouter();
  const globalContext = useContext(GlobalContext);
  const { data: signMessageData, signMessageAsync } = useSignMessage({
    config,
  });
  const { data: signUpData } = useSignUp(account?.address!, signMessageData!);
  const { data: loginData } = useLogin(account?.address!, signMessageData!);

  /**
   * authenticate
   */
  const authenticate = async () => {
    try {
      globalContext.setLoading(true);
      // get .env values
      await signMessageAsync({ message: env.SECRET_MESSAGE });
    } catch (err) {
      console.error("error:", err);
    } finally {
      globalContext.setLoading(false);
    }
  };

  useEffect(() => {
    if (signMessageData) {
      if ((signUpData || loginData) && !routePushed) {
        console.log("setRoutePushed(true)");
        setRoutePushed(true);
        router.push("/my-box");
      }
    }
  }, [signMessageData, signUpData, loginData]);

  return (
    <div
      className={`w-screen h-screen 
                    bg-HeroImageLight dark:bg-HeroImageDark bg-cover 
                    text-Neutral-Foreground-1-Rest`}
    >
      <div className="w-full h-full px-20 flex items-center">
        <div className="flex flex-col">
          {globalContext.loading ? (
            <Loading />
          ) : (
            <>
              <h1 className="flex flex-row py-8 text-DisplayLarge">
                Welcome to Monas
                <span className="text-Primary-Foreground-1-Rest">.</span>
              </h1>
              <div className="flex flex-col">
                <p className="pb-6 text-HeadlineSmall">
                  Give you the power of data and <br />
                  the future is yours to decide!
                </p>
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                  }) => {
                    const ready = mounted && authenticationStatus !== "loading";
                    const connected =
                      ready &&
                      account &&
                      chain &&
                      (!authenticationStatus ||
                        authenticationStatus === "authenticated");

                    return (
                      <div
                        className="w-fit rounded-full text-LabelMediumProminent text-center [&_button]:rounded-full [&_button]:p-1.5 
                        bg-Primary-Background-1-Rest [&_button]:hover:bg-Primary-Background-1-Hover [&_button]:active:bg-Primary-Background-1-Pressed [&_button]:disabled:bg-Primary-Background-Disabled-Rest
                        [&_button]:text-Neutral-Foreground-OnPrimary-Rest [&_button]:disabled:text-Neutral-Foreground-Disabled-OnPrimary-Rest
                        [&_button]:w-72"
                        {...(!ready && {
                          "aria-hidden": true,
                          style: {
                            opacity: 0,
                            pointerEvents: "none",
                            userSelect: "none",
                          },
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <button
                                onClick={() => {
                                  openConnectModal();
                                }}
                                type="button"
                              >
                                Connect Wallet
                              </button>
                            );
                          }
                          if (chain.unsupported) {
                            return (
                              <button onClick={openChainModal} type="button">
                                Wrong network
                              </button>
                            );
                          }

                          return (
                            <div style={{ display: "flex", gap: 12 }}>
                              <button onClick={authenticate} type="button">
                                signUp/login
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
