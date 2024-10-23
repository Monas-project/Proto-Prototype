"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box24Regular,
  BoxCheckmark24Regular,
  PeopleCommunity24Regular,
  Box24Filled,
  BoxCheckmark24Filled,
  PeopleCommunity24Filled,
  MailInbox24Filled,
  MailInbox24Regular,
  SignOut20Filled,
} from "@fluentui/react-icons";
import { Logomark } from "@/public/Logomark";
import Persona from "@/components/elements/Persona/Persona";
import { useState } from "react";
import { VerticalTabProps } from "@/components/elements/Tabs/VerticalTab";
import ColorTheme from "../Settings/ColorTheme";
import Dialog from "@/components/elements/Dialog/Dialog";
import { useAccount, useConfig, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalProvider";

const tabs: VerticalTabProps[] = [{ label: "Theme", content: <ColorTheme /> }];

export const NavigationDrawer = () => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLogOutMenuOpen, setIsLogOutMenuOpen] = useState(false);

  const pathname = usePathname();
  const config = useConfig();
  const { disconnect } = useDisconnect({ config });
  const router = useRouter();
  const globalContext = useContext(GlobalContext);
  const { address } = useAccount({ config });

  const navContents = [
    {
      name: "My Box",
      href: "/my-box",
      iconA: Box24Filled,
      iconB: Box24Regular,
    },
    {
      name: "Shared Box",
      href: "/shared-box",
      iconA: BoxCheckmark24Filled,
      iconB: BoxCheckmark24Regular,
    },
    {
      name: "Get Box",
      href: "/get-box",
      iconA: MailInbox24Filled,
      iconB: MailInbox24Regular,
    },
    // {
    //   name: "Friend List",
    //   href: "/friend-list",
    //   iconA: PeopleCommunity24Filled,
    //   iconB: PeopleCommunity24Regular,
    // },
  ];

  // logoutの実装
  const handleLogout = async () => {
    try {
      globalContext.setAccessToken(undefined);
      disconnect();
      router.push("/");
    } catch (error) {
      console.error("ログアウト中にエラーが発生しました:", error);
    }
  };

  return (
    <div className="min-w-[240px] h-full flex relative">
      <div className="h-[52px] absolute flex items-center px-6">
        <Logomark height={15} color="#D71768" />
      </div>

      <div className="self-center w-full space-y-4 px-2">
        {navContents.map((item) => (
          <Link href={item.href} key={item.name} className="flex flex-col">
            <div
              className={`rounded 
                            ${
                              pathname === item.href
                                ? "bg-Primary-Background-1-Rest text-Neutral-Foreground-OnPrimary-Rest"
                                : "bg-Neutral-Background-Subtle-Rest hover:bg-Neutral-Background-Subtle-Hover active:bg-Neutral-Background-Subtle-Pressed"
                            }`}
            >
              <div className="flex flex-row px-2 py-1.5 items-center">
                <div
                  className={`pr-3
                                ${
                                  pathname === item.href
                                    ? "text-Neutral-Foreground-OnPrimary-Rest"
                                    : "text-Neutral-Foreground-4-Rest"
                                }`}
                >
                  <div className="flex p-1">
                    {pathname === item.href ? <item.iconA /> : <item.iconB />}
                  </div>
                </div>
                <span
                  className={`h-fit text-LabelLargeProminent
                                ${
                                  pathname === item.href
                                    ? "text-Neutral-Foreground-OnPrimary-Rest"
                                    : "text-Neutral-Foreground-3-Rest"
                                }`}
                >
                  {item.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="w-full absolute bottom-0 bg-Neutral-Background-3-Rest">
        <div className="relative">
          <Persona
            avatarSize={32}
            primaryText={
              address
                ? address.slice(0, 6) + "..." + address.slice(-4)
                : "No Address"
            }
            onClickAvatars={() => setIsLogOutMenuOpen(true)}
            onClickIcon={() => setIsSettingsModalOpen(true)}
          />
          {isLogOutMenuOpen && (
            <div
              onClick={(e) =>
                e.target === e.currentTarget && setIsLogOutMenuOpen(false)
              }
              className="fixed inset-0 z-10"
            >
              <div className="absolute bottom-14 mb-2 ml-2 w-60 rounded-lg px-2 py-1.5 bg-Neutral-Background-1-Rest shadow-Elevation04-Light dark:shadow-Elevation04-Dark">
                <button
                  className="w-full flex flex-row space-x-2 px-2 py-1.5 bg-Neutral-Background-1-Rest hover:bg-Neutral-Background-1-Hover active:bg-Neutral-Background-1-Pressed text-Neutral-Foreground-2-Rest"
                  onClick={handleLogout}
                >
                  <SignOut20Filled />
                  <span className="text-LabelMedium">Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isSettingsModalOpen && (
        <div
          onClick={(e) =>
            e.target === e.currentTarget && setIsSettingsModalOpen(false)
          }
          className="z-10 fixed top-0 left-0 right-0 bottom-0 bg-Neutral-Background-Overlay-Rest"
        >
          <Dialog
            NavBarVis={true}
            tabs={tabs}
            primaryButtonProps={{
              label: "OK",
              onClick: () => setIsSettingsModalOpen(false),
            }}
            secondaryButtonVis={false}
          />
        </div>
      )}
    </div>
  );
};
