import Button from "@/components/elements/Button/Button";
import NotificationList from "@/components/elements/NotificationList/NotificationList";
import LayoutMain from "@/components/layouts/Layout/LayoutMain";
import Loading from "@/components/loading";
import { GlobalContext } from "@/context/GlobalProvider";
import { signer } from "@/hooks/useEthersProvider";
import { getPushInfo } from "@/hooks/usePushProtocol";
import { ListInfo } from "@/utils/type";
import { CheckboxUnchecked24Regular } from "@fluentui/react-icons";
import { useContext, useEffect, useState } from "react";

export default function GetBox() {
  const [pushList, setPushList] = useState<ListInfo[]>([]);
  const globalContext = useContext(GlobalContext);

  useEffect(() => {
    const init = async () => {
      globalContext.setLoading(true);
      if (signer != undefined) {
        const list = await getPushInfo(signer);
        setPushList(list);
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
                  <Button fotterVisible={true} label="Type" />
                  <Button fotterVisible={true} label="People" />
                  <Button fotterVisible={true} label="Modified" />
                </div>
                <div className="flex flex-row space-x-4">

                </div>
              </div>
            </div>

            <div className="p-6">
              <ul className="w-full space-y-4">
                {pushList.length != 0 && (
                  <>
                    {pushList.map((push, i) => (
                      <NotificationList label={push.title} title={push.message} cid="にゃははははは" />
                    ))}
                  </>
                )}
                <NotificationList label="ラベルだよ～ん" title="タイトルだよ～ん" cid="にゃははははは" />
              </ul>
            </div>
          </>
        )}
      </div>
    </LayoutMain>
  );
}
