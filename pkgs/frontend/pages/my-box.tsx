import Button from "@/components/elements/Button/Button";
import CompoundButton from "@/components/elements/Button/CompoundButton";
import FileFormatIcon from "@/components/elements/FileFormatIcon/FileFormatIcon";
import Input from "@/components/elements/Input/Input";
import LayoutMain from "@/components/layouts/Layout/LayoutMain";
import Loading from "@/components/loading";
import { GlobalContext } from "@/context/GlobalProvider";
import {
  ArrowDownload20Regular,
  Delete20Regular,
  DocumentArrowUp20Regular,
  FolderAdd20Regular,
  Grid20Filled,
  Key20Regular,
  MoreVertical16Regular,
  Share20Regular,
} from "@fluentui/react-icons";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useConfig } from "wagmi";
import { ResponseData } from "./api/env";
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

const fileTableTr = [
  { th: "Name", width: 55, mWidth: 300 },
  { th: "Owner", width: 12.5, mWidth: 100 },
  { th: "Data Modified", width: 12.5, mWidth: 100 },
  { th: "", width: 20, mWidth: 152 },
];

export default function MyBox() {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isSelectedId, setIsSelectedId] = useState<any>(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

  const openShareModal = (cid: string, key: string) => {
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
      globalContext.setLoading(true);
      const res = await createNode(accessToken!, formData);

      setRootId(res.root_id);
      setCurrentNodeCid(res.root_id);
      setCurrentNodeKey(rootKey!);
      setBreadcrumbItems([
        {
          text: "Own Space",
          path: "/my-box",
          cid: rootId!,
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
      globalContext.setLoading(false);
      setIsFileUploadModalOpen(false);
    }
  };

  /**
   * createFolder function
   */
  const createFolder = async () => {
    setIsCreateFolderModalOpen(true);
    if (!address || !currentNodeCid || !currentNodeKey) return;
    try {
      globalContext.setLoading(true);
      // TODO call encrypt API from cryptree
      // TODO call ipfs API from cryptree
      // call same API when upload file & create folder
      // call insert method
      const formData = new FormData();
      formData.append("name", "test " + Math.random().toString(36).slice(-8));
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
          cid: rootId!,
          key: rootKey!,
        },
      ]);

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
      globalContext.setLoading(false);
    }
  };

  /**
   * deleteFile function
   */
  const deleteFile = async (cid: string) => {
    if (!address || !currentNodeCid || !currentNodeKey) return;
    try {
      globalContext.setLoading(true);
      // TODO call encrypt API from cryptree
      // TODO call ipfs API from cryptree
      // call same API when upload file & create folder
      // call insert method
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
          cid: rootId!,
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
      globalContext.setLoading(false);
    }
  };

  /**
   * shareFile function
   */
  const shareFile = async () => {
    if (!address || !to || !sharingData) return;
    try {
      globalContext.setLoading(true);

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
      globalContext.setLoading(false);
      setIsShareModalOpen(false);
    }
  };

  /**
   * reEncrypt function
   */
  const reEncrypt = async (targetCid: string) => {
    try {
      globalContext.setLoading(true);

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
      globalContext.setLoading(false);
    }
  };

  /**
   * download function
   */
  const download = async (data: string, name: string) => {
    try {
      globalContext.setLoading(true);
      // TODO CID
      // Fileオブジェクトをダウンロードする処理を入れる。
      downloadFile(data, name);

      toast.success(
        "download File Success!! Please wait a moment until it is reflected.",
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
      globalContext.setLoading(false);
    }
  };

  useEffect(() => {
    globalContext.setLoading(false);
    const init = async () => {
      if (!isConnected && !address) {
        router.push("/");
        return;
      }
      globalContext.setLoading(true);
      try {
        console.log("getNodeData:", getNodeData);
        initializeFirebaseMessaging();
      } catch (err) {
        console.error("err", err);
      } finally {
        globalContext.setLoading(false);
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
                <Button
                  layout="subtle"
                  headerVisible={true}
                  headerIcon={<Grid20Filled />}
                  labelVisible={false}
                />
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-4">
                  <Button label="Type" fotterVisible={true} />
                  <Button label="People" fotterVisible={true} />
                  <Button label="Modified" fotterVisible={true} />
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
                    onClick={createFolder}
                  />
                </div>
              </div>
            </div>

            <div className="w-full grow flex flex-col p-6 space-y-6">
              {/* <div>{JSON.stringify(getNodeData)}</div> */}
              <According label="Recent Files">
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
              </According>

              <div className="grow rounded-lg px-6 bg-Neutral-Background-1-Rest">
                <table className="w-full">
                  <thead className="border-b border-Neutral-Stroke-1-Rest text-TitleSmall text-Neutral-Foreground-Variant-Rest">
                    <tr className="w-full h-fit flex flex-row space-x-8 px-6 py-4 text-left [&_th]:p-0 [&_th]:font-medium">
                      {fileTableTr.map((x) => (
                        <th
                          key={x.th}
                          style={{
                            width: `${x.width}%`,
                            minWidth: `${x.mWidth}px`,
                          }}
                        >
                          {x.th}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="flex flex-col w-full last:[&>tr]:border-none">
                    {getNodeData?.children?.map((data: any, i) => (
                      <tr
                        key={i}
                        onClick={() => {
                          setIsSelected(!isSelected);
                          setIsSelectedId(getNodeData.metadata.children[i].cid);
                        }}
                        onDoubleClick={() =>
                          openNode(
                            data.metadata.name,
                            getNodeData.metadata.children[i].cid,
                            data.subfolder_key
                          )
                        }
                        className={`w-full flex flex-row px-6 py-2.5 space-x-8 border-b border-Neutral-Stroke-1-Rest text-BodyLarge items-center group 
                                    ${
                                      isSelected
                                        ? "bg-Neutral-Background-1-Pressed"
                                        : "bg-Neutral-Background-1-Rest hover:bg-Neutral-Background-1-Hover"
                                    } [&>td]:flex [&>td]:p-0`}
                      >
                        <td
                          style={{ width: `${fileTableTr[0].width}%` }}
                          className="flex flex-row items-center space-x-6"
                        >
                          {data.file_data && data.file_data.length > 0 ? (
                            <FileFormatIcon fileType="DocumentIcon" />
                          ) : (
                            <FileFormatIcon fileType="FolderIcon" />
                          )}
                          <div>{data.metadata.name}</div>
                        </td>
                        <td style={{ width: `${fileTableTr[1].width}%` }}>
                          {data.metadata.owner_id.slice(0, 6) +
                            "..." +
                            data.metadata.owner_id.slice(-4)}
                        </td>
                        <td style={{ width: `${fileTableTr[2].width}%` }}>
                          {new Date(
                            data.metadata.created_at
                          ).toLocaleDateString() +
                            " " +
                            new Date(
                              data.metadata.created_at
                            ).toLocaleTimeString()}
                        </td>
                        <td
                          style={{ width: `${fileTableTr[3].width}%` }}
                          className="space-x-5 justify-end items-center"
                        >
                          <div
                            className={`space-x-3 flex flex-row group-hover:flex ${
                              isSelected ? "flex" : "hidden"
                            }`}
                          >
                            {data.file_data && data.file_data.length > 0 ? (
                              <Button
                                layout="subtle"
                                headerVisible={true}
                                headerIcon={<ArrowDownload20Regular />}
                                labelVisible={false}
                                onClick={() =>
                                  download(data.file_data, data.metadata.name)
                                }
                              />
                            ) : null}
                            <Button
                              layout="subtle"
                              headerVisible={true}
                              headerIcon={<Share20Regular />}
                              labelVisible={false}
                              onClick={() => {
                                const key = getNodeData?.metadata.children[i].fk
                                  ? getNodeData?.metadata.children[i].fk
                                  : getNodeData?.metadata.children[i].sk;
                                openShareModal(
                                  getNodeData?.metadata.children[i].cid,
                                  key
                                );
                              }}
                            />
                            <Button
                              layout="subtle"
                              headerVisible={true}
                              headerIcon={<Delete20Regular />}
                              labelVisible={false}
                              onClick={async () => {
                                await deleteFile(
                                  getNodeData.metadata.children[i].cid
                                );
                              }}
                            />
                            <Button
                              layout="subtle"
                              headerVisible={true}
                              headerIcon={<Key20Regular />}
                              labelVisible={false}
                              onClick={() =>
                                reEncrypt(getNodeData.metadata.children[i].cid)
                              }
                            />
                          </div>
                          <Button
                            layout="subtle"
                            headerVisible={true}
                            headerIcon={<MoreVertical16Regular />}
                            labelVisible={false}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              primaryButtonProps={{ label: "Create" }}
              secondaryButtonProps={{
                label: "Cancel",
                onClick: () => setIsCreateFolderModalOpen(false),
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
                  // inputValue={folderName}
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
