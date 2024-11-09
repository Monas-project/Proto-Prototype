import NotificationList from "@/components/elements/NotificationList/NotificationList";
import LayoutMain from "@/components/layouts/Layout/LayoutMain";
import Loading from "@/components/loading";
import { GlobalContext } from "@/context/GlobalProvider";
import { getMessagesByReceiver, Message } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useAccount, useConfig } from "wagmi";

export default function GetBox() {
  const [messageList, setMessageList] = useState<Message[]>([]);
  const globalContext = useContext(GlobalContext);
  const config = useConfig();
  const { address, isConnected } = useAccount({ config });
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      globalContext.setLoading(true);
      if (!isConnected && !address) {
        router.push("/");
        return;
      }
      if (address) {
        setMessageList(await getMessagesByReceiver(address));
      }
      globalContext.setLoading(false);
    };
    init();
  }, []);

  return (
    <LayoutMain>
      <div className="bg-Neutral-Background-2-Rest h-full w-full flex flex-col text-Neutral-Foreground-1-Rest overflow-y-auto">
        {globalContext.loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex flex-col space-y-4 p-6 shadow-Elevation01-Light dark:shadow-Elevation01-Dark sticky top-0 bg-Neutral-Background-2-Rest">
              <div className="flex flex-row justify-between items-center">
                <div className="text-TitleLarge">Get Box</div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-4">
                  {/* <Button fotterVisible={true} label="Type" />
                  <Button fotterVisible={true} label="People" />
                  <Button fotterVisible={true} label="Modified" /> */}
                </div>
                <div className="flex flex-row space-x-4"></div>
              </div>
            </div>

            <div className="p-6">
              <ul className="w-full space-y-4">
                {messageList.length > 0 && (
                  <>
                    {messageList.map((push, i) => (
                      <NotificationList
                        label={`Shared Info from ${push.sender}`}
                        title={push.content}
                        cid={push.cid || ""}
                        subfolderKey={push.key || ""}
                        rootId={push.rootId || ""}
                        key={push.timestamp.toString()}
                        timestamp={push.timestamp}
                      />
                    ))}
                  </>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </LayoutMain>
  );
}
