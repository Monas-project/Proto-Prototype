import Button from "@/components/elements/Button/Button";
import Dialog from "@/components/elements/Dialog/Dialog";
import Input from "@/components/elements/Input/Input";
import LayoutMain from "@/components/layouts/Layout/LayoutMain";
import { GlobalContext } from "@/context/GlobalProvider";
import { getBox } from "@/cryptree/getBox";
import { downloadFile } from "@/utils/downloadFile";
import { downloadFolderZip } from "@/cryptree/downloadFolderZip";
import { Grid20Filled, MailInbox20Filled } from "@fluentui/react-icons";
import { useContext, useEffect, useState } from "react";
import NodeTable from "@/components/features/NodeTable";
import { NodeData } from "@/cryptree/types";
import Breadcrumb from "@/components/elements/Breadcrumb/Breadcrumb";
import { useGetNode } from "@/hooks/cryptree/useGetNode";

export default function SharedBox() {
  const [isGetBoxModalOpen, setIsGetBoxModalOpen] = useState(false);
  const [cid, setCid] = useState<string>("");
  const [currentCid, setCurrentCid] = useState<string>("");
  const [currentSubfolderKey, setCurrentSubfolderKey] = useState<string>("");
  const [subfolderKey, setSubfolderKey] = useState<string>("");
  const globalContext = useContext(GlobalContext);
  const { rootKey, accessToken, loading, setLoading } = globalContext;
  const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([
    {
      text: "Shared Box",
      path: "/shared-box",
      cid: cid + "a",
      key: rootKey + "a",
    },
  ]);

  const {
    data: getNodeData,
    error: getNodeError,
    setNodeData,
  } = useGetNode(currentSubfolderKey!, currentCid!);

  const receive = async () => {
    if (!accessToken) {
      return;
    }
    if (!cid || !subfolderKey) {
      return;
    }
    setLoading(true);
    try {
      const sharedNode = await getRootSharedNodeData(cid, subfolderKey);
      if (!sharedNode) {
        throw new Error("Failed to get shared node");
      }
      setNodeData(sharedNode);
      setLoading(false);
      setCid("");
      setSubfolderKey("");
      setIsGetBoxModalOpen(false);
    } catch (err) {
      console.error("err:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRootSharedNodeData = async (
    cid: string,
    subfolderKey: string
  ): Promise<NodeData | undefined> => {
    const res = await getBox(accessToken!, subfolderKey, cid);
    if (!res) {
      return;
    }
    return {
      metadata: {
        name: "Shared Space",
        owner_id: res.metadata.owner_id,
        created_at: res.metadata.created_at,
        children: [
          {
            cid,
            sk: res.subfolder_key,
          },
        ],
      },
      file_data: res.file_data,
      subfolder_key: res.subfolder_key,
      root_id: res.root_id,
      children: [res],
    };
  };

  const download = async (node: NodeData, cid: string) => {
    if (!node) {
      return;
    }
    if (!node.file_data) {
      await downloadFolderZip(accessToken!, cid, node.subfolder_key);
    } else {
      downloadFile(node.file_data, node.metadata.name);
    }
  };

  const handleCloseButton = () => {
    setIsGetBoxModalOpen(false);
    setCid("");
    setSubfolderKey("");
  };

  const openNode = async (name: string, cid: string, subfolderKey: string) => {
    setCurrentCid(cid);
    setCurrentSubfolderKey(subfolderKey);
    const items = breadcrumbItems;
    setBreadcrumbItems([
      ...items,
      {
        text: name,
        path: "/shared-box",
        cid,
        key: subfolderKey,
      },
    ]);
  };

  const moveToDir = async (index: number) => {
    const items = breadcrumbItems.slice(0, index + 1);
    if (index === 0) {
      setCurrentCid("");
      setCurrentSubfolderKey("");
      const firstItem = breadcrumbItems.slice(1, 2)[0];
      console.log("firstItem:", firstItem);
      const sharedNode = await getRootSharedNodeData(
        firstItem.cid,
        firstItem.key
      );
      if (!sharedNode) {
        return;
      }
      setNodeData(sharedNode);
    } else {
      setCurrentCid(breadcrumbItems[index].cid);
      setCurrentSubfolderKey(breadcrumbItems[index].key);
    }
    setBreadcrumbItems(items);
  };

  return (
    <LayoutMain>
      <div className="bg-Neutral-Background-2-Rest h-full w-full flex flex-col text-Neutral-Foreground-1-Rest overflow-y-auto">
        <div className="flex flex-col space-y-4 p-6 shadow-Elevation01-Light dark:shadow-Elevation01-Dark sticky top-0 bg-Neutral-Background-2-Rest">
          <div className="flex flex-row justify-between items-center">
            <Breadcrumb items={breadcrumbItems} onNavigate={moveToDir} />
            {/* <Button
              layout="subtle"
              headerVisible={true}
              headerIcon={<Grid20Filled />}
              labelVisible={false}
            /> */}
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4">
              {/* <Button label="Type" fotterVisible={true} />
              <Button label="People" fotterVisible={true} />
              <Button label="Modified" fotterVisible={true} /> */}
            </div>
            <div className="flex flex-row space-x-4">
              <Button
                headerVisible={true}
                headerIcon={<MailInbox20Filled />}
                label="Get Box"
                onClick={() => setIsGetBoxModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <div className="w-full grow flex flex-col p-6 space-y-6">
          <div className="grow rounded-lg px-6 bg-Neutral-Background-1-Rest">
            {getNodeData && (
              <NodeTable
                nodeData={getNodeData}
                openNode={openNode}
                download={download}
              />
            )}
          </div>
        </div>

        {/* GetBox Button Dialog */}
        {isGetBoxModalOpen && (
          <div
            onClick={(e) =>
              e.target === e.currentTarget && setIsGetBoxModalOpen(false)
            }
            className="fixed top-0 left-0 right-0 bottom-0 bg-Neutral-Background-Overlay-Rest"
          >
            <Dialog
              primaryButtonProps={{
                label: "Receive",
                onClick: receive,
                disabled: cid === "" || subfolderKey === "" || loading,
              }}
              secondaryButtonProps={{
                label: "Close",
                onClick: handleCloseButton,
                disabled: loading,
              }}
            >
              <div className="py-6 text-center">
                <span className="text-TitleLarge text-Neutral-Foreground-1-Rest">
                  Get Box
                </span>
              </div>
              <div className="space-y-4">
                <Input
                  id="cid"
                  label="CID"
                  inputValue={cid}
                  setInputValue={setCid}
                  layout="filledDarker"
                  placeholder="Enter CID"
                />
                <Input
                  id="secretKey"
                  label="Secret Key"
                  inputValue={subfolderKey}
                  setInputValue={setSubfolderKey}
                  layout="filledDarker"
                  placeholder="Enter Secret Key"
                />
              </div>
            </Dialog>
          </div>
        )}
      </div>
    </LayoutMain>
  );
}
