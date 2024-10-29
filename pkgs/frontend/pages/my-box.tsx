import Button from "@/components/elements/Button/Button";
import CompoundButton from "@/components/elements/Button/CompoundButton";
import FileFormatIcon from "@/components/elements/FileFormatIcon/FileFormatIcon";
import Input from "@/components/elements/Input/Input";
import LayoutMain from "@/components/layouts/Layout/LayoutMain";
import Loading from "@/components/loading";
import { GlobalContext } from "@/context/GlobalProvider";
import {
  DocumentArrowUp20Regular,
  FolderAdd20Regular,
  Grid20Filled,
} from "@fluentui/react-icons";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useConfig } from "wagmi";
import { useGetNode } from "@/hooks/cryptree/useGetNode";
import { useRouter } from "next/router";
import { createNode } from "@/cryptree/createNode";
import { deleteNode } from "@/cryptree/delete";
import FileUpload from "@/components/elements/FileUpload/FileUpload";
import { downloadFile } from "@/utils/downloadFile";
import { reEncryptNode } from "@/cryptree/reEncryptNode";
import Breadcrumb from "@/components/elements/Breadcrumb/Breadcrumb";
import According from "@/components/elements/According/According";
import { initializeFirebaseMessaging, sendMessage } from "@/utils/firebase";
import Dialog from "@/components/elements/Dialog/Dialog";
import { NodeData } from "@/cryptree/types";
import NodeTable from "@/components/features/NodeTable";
import { downloadFolderZip } from "@/cryptree/downloadFolderZip";

export default function MyBox() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [to, setTo] = useState<any>();
  const router = useRouter();
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const [sharingData, setSharingData] = useState<any>(null);

  const globalContext = useContext(GlobalContext);
  const config = useConfig();
  const { address, isConnected } = useAccount({ config });
  const {
    rootId,
    rootKey,
    accessToken,
    setRootId,
    currentNodeCid,
    setCurrentNodeCid,
    currentNodeKey,
    setCurrentNodeKey,
    loading,
    setLoading,
  } = globalContext;
  const { data: getNodeData, error: getNodeError } = useGetNode(
    currentNodeKey!,
    currentNodeCid!
  );

  const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([
    {
      text: "Own Space",
      path: "/my-box",
      cid: rootId!,
      key: rootKey!,
    },
  ]);

  const openShareModal = (childInfo: {
    cid: string;
    fk?: string;
    sk?: string;
  }) => {
    const { cid, fk, sk } = childInfo;
    const key = fk ? fk : sk;
    setSharingData({ cid, key });
    setIsShareModalOpen(true);
  };

  const openNode = async (name: string, cid: string, subfolderKey: string) => {
    setCurrentNodeCid(cid);
    setCurrentNodeKey(subfolderKey);
    const items = breadcrumbItems;
    setBreadcrumbItems([
      ...items,
      {
        text: name,
        path: "/my-box",
        cid,
        key: subfolderKey,
      },
    ]);
  };

  const moveToDir = (index: number) => {
    const items = breadcrumbItems.slice(0, index + 1);
    setCurrentNodeCid(breadcrumbItems[index].cid);
    setCurrentNodeKey(breadcrumbItems[index].key);
    setBreadcrumbItems(items);
  };

  /**
   * uploadFile function
   */
  const uploadFile = async (selectedFile: File | null) => {
    if (!selectedFile) return; // ファイルが選択されていなければ早期リターン

    const formData = new FormData();
    formData.append("file_data", selectedFile);
    formData.append("name", selectedFile.name);
    formData.append("owner_id", address!);
    formData.append("subfolder_key", currentNodeKey!);
    formData.append("root_key", rootKey!);
    formData.append("parent_cid", currentNodeCid!);

    // ここにファイルアップロードのためのAPI呼び出し処理を記述します
    console.log("ファイルをアップロード中…");
    try {
      setLoading(true);
      const res = await createNode(accessToken!, formData);

      setRootId(res.root_id);
      setCurrentNodeCid(res.root_id);
      setCurrentNodeKey(rootKey!);
      setBreadcrumbItems([
        {
          text: "Own Space",
          path: "/my-box",
          cid: res.root_id,
          key: rootKey!,
        },
      ]);

      toast.success(
        "Upload Success!! Please wait a moment until it is reflected.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (err) {
      console.error("err uploadFile:", err);
      toast.error("Failed...1", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
      setIsFileUploadModalOpen(false);
    }
  };

  const createFolderModalOpen = () => {
    setIsCreateFolderModalOpen(true);
  };

  /**
   * createFolder function
   */
  const createFolder = async () => {
    if (!address || !currentNodeCid || !currentNodeKey) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", folderName);
      formData.append("owner_id", address);
      formData.append("subfolder_key", currentNodeKey!);
      formData.append("root_key", rootKey!);
      formData.append("parent_cid", currentNodeCid!);
      const res = await createNode(accessToken!, formData);
      setRootId(res.root_id);
      setCurrentNodeCid(res.root_id);
      setCurrentNodeKey(rootKey!);
      setBreadcrumbItems([
        {
          text: "Own Space",
          path: "/my-box",
          cid: res.root_id,
          key: rootKey!,
        },
      ]);
      setFolderName("");
      toast.success(
        "CreateFolder Success!! Please wait a moment until it is reflected.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (err) {
      console.error("err createFolder:", err);
      toast.error("Failed...", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
      setIsCreateFolderModalOpen(false);
    }
  };

  /**
   * deleteFile function
   */
  const deletion = async (cid: string) => {
    if (!address || !currentNodeCid || !currentNodeKey) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("cid", cid);
      formData.append("subfolder_key", currentNodeKey!);
      formData.append("root_key", rootKey!);
      formData.append("parent_cid", currentNodeCid!);
      const res = await deleteNode(accessToken!, formData);
      setRootId(res.root_id);
      setCurrentNodeCid(res.root_id);
      setCurrentNodeKey(rootKey!);
      setBreadcrumbItems([
        {
          text: "Own Space",
          path: "/my-box",
          cid: res.root_id,
          key: rootKey!,
        },
      ]);

      toast.success(
        "Delete File Success!! Please wait a moment until it is reflected.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (err) {
      console.error("err deleteFile:", err);
      toast.error("Failed...", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * shareFile function
   */
  const shareFile = async () => {
    if (!address || !to || !sharingData) return;
    try {
      setLoading(true);

      await sendMessage(address, to, sharingData.cid, sharingData.key, rootId!);

      toast.success(
        "Share File Success!! Please wait a moment until it is reflected.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (err) {
      console.error("err shareFile:", err);
      toast.error("Failed...", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
      setIsShareModalOpen(false);
    }
  };

  /**
   * reEncrypt function
   */
  const reEncrypt = async (targetCid: string) => {
    try {
      setLoading(true);

      const res = await reEncryptNode(
        accessToken!,
        targetCid,
        currentNodeKey!,
        currentNodeCid!,
        rootKey!
      );

      console.log("res:", res);

      toast.success(
        "reEncrypt File Success!! Please wait a moment until it is reflected.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (err) {
      console.error("err reEncrypt:", err);
      toast.error("Failed...", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * download function
   */
  // const download = async (data: string, name: string) => {
  const download = async (node: NodeData, cid: string) => {
    try {
      setLoading(true);

      if (!node.file_data) {
        await downloadFolderZip(accessToken!, cid, node.subfolder_key);
      } else {
        downloadFile(node.file_data, node.metadata.name);
      }

      toast.success(
        "download Success!! Please wait a moment until it is reflected.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (err) {
      console.error("err download:", err);
      toast.error("Failed...", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
    const init = async () => {
      if (!isConnected && !address) {
        router.push("/");
        return;
      }
      setLoading(true);
      try {
        console.log("getNodeData:", getNodeData);
        initializeFirebaseMessaging();
      } catch (err) {
        console.error("err", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [currentNodeCid, currentNodeKey, isConnected]);

  return (
    <LayoutMain>
      <div className="bg-Neutral-Background-2-Rest h-full w-full flex flex-col text-Neutral-Foreground-1-Rest overflow-y-auto">
        {globalContext.loading ? (
          <Loading />
        ) : (
          <>
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
                    label="Upload File"
                    headerVisible={true}
                    headerIcon={<DocumentArrowUp20Regular />}
                    onClick={() => setIsFileUploadModalOpen(true)}
                  />
                  <Button
                    label="Create Folder"
                    headerVisible={true}
                    headerIcon={<FolderAdd20Regular />}
                    onClick={createFolderModalOpen}
                  />
                </div>
              </div>
            </div>

            <div className="w-full grow flex flex-col p-6 space-y-6">
              {/* <According label="Recent Files">
                <div className="w-full flex flex-row space-x-4 pl-6 first:pl-0">
                  <CompoundButton
                    headerIcon={<FileFormatIcon fileType="FolderIcon" />}
                    layout="neutral"
                    primaryText="AAAAAAAAAA"
                    secondaryText="3 days ago"
                  />
                  <CompoundButton
                    headerIcon={<FileFormatIcon fileType="FolderIcon" />}
                    layout="neutral"
                    primaryText="AAAAAAAAAA"
                    secondaryText="3 days ago"
                  />
                  <CompoundButton
                    headerIcon={<FileFormatIcon fileType="FolderIcon" />}
                    layout="neutral"
                    primaryText="AAAAAAAAAA"
                    secondaryText="3 days ago"
                  />
                  <CompoundButton
                    headerIcon={<FileFormatIcon fileType="FolderIcon" />}
                    layout="neutral"
                    primaryText="AAAAAAAAAA"
                    secondaryText="3 days ago"
                  />
                  <CompoundButton
                    headerIcon={<FileFormatIcon fileType="FolderIcon" />}
                    layout="neutral"
                    primaryText="AAAAAAAAAA"
                    secondaryText="3 days ago"
                  />
                  <CompoundButton
                    headerIcon={<FileFormatIcon fileType="FolderIcon" />}
                    layout="neutral"
                    primaryText="AAAAAAAAAA"
                    secondaryText="3 days ago"
                  />
                </div>
              </According> */}

              <div className="grow rounded-lg px-6 bg-Neutral-Background-1-Rest">
                {getNodeData && (
                  <NodeTable
                    nodeData={getNodeData}
                    openNode={openNode}
                    download={download}
                    shareButtonClick={openShareModal}
                    deleteNode={deletion}
                    reEncryptNode={reEncrypt}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Upload File Button Dialog */}
        {isFileUploadModalOpen && (
          <div
            onClick={(e) =>
              e.target === e.currentTarget && setIsFileUploadModalOpen(false)
            }
            className="fixed top-0 left-0 right-0 bottom-0 bg-Neutral-Background-Overlay-Rest"
          >
            <FileUpload
              onFileSelect={(file) => console.log("file: ", file)}
              uploadFile={uploadFile}
              close={() => setIsFileUploadModalOpen(false)}
            />
          </div>
        )}

        {/* Create Folder Button Dialog */}
        {isCreateFolderModalOpen && (
          <div
            onClick={(e) =>
              e.target === e.currentTarget && setIsCreateFolderModalOpen(false)
            }
            className="fixed top-0 left-0 right-0 bottom-0 bg-Neutral-Background-Overlay-Rest"
          >
            <Dialog
              primaryButtonProps={{
                label: "Create",
                onClick: () => createFolder(),
                disabled: loading,
              }}
              secondaryButtonProps={{
                label: "Cancel",
                onClick: () => setIsCreateFolderModalOpen(false),
                disabled: loading,
              }}
            >
              <div className="py-6 text-center">
                <span className="text-TitleLarge text-Neutral-Foreground-1-Rest">
                  Create Folder
                </span>
              </div>
              <div className="space-y-4">
                <Input
                  id="folderName"
                  label="New folder name"
                  inputValue={folderName}
                  setInputValue={setFolderName}
                  layout="filledDarker"
                  placeholder="new folder"
                />
              </div>
            </Dialog>
          </div>
        )}

        {/* Share Button Dialog */}
        {isShareModalOpen && (
          <div
            onClick={(e) =>
              e.target === e.currentTarget && setIsShareModalOpen(false)
            }
            className="fixed top-0 left-0 right-0 bottom-0 bg-Neutral-Background-Overlay-Rest"
          >
            <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 rounded-lg bg-Neutral-Background-1-Rest p-8 space-y-6">
              <div className="text-TitleLarge">Address</div>
              <Input
                id="address"
                label=""
                layout="outline"
                inputValue={to}
                setInputValue={setTo}
              />
              <div className="w-full flex flex-row justify-between">
                <Button
                  layout="neutral"
                  label="Close"
                  onClick={() => setIsShareModalOpen(false)}
                />
                <Button
                  layout="primary"
                  label="send"
                  onClick={async () => {
                    // call shareFile method
                    await shareFile();
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </LayoutMain>
  );
}
