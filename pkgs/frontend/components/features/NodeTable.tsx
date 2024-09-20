import { FC, useState } from "react";
import FileFormatIcon from "../elements/FileFormatIcon/FileFormatIcon";
import Button from "../elements/Button/Button";
import {
  ArrowDownload20Regular,
  Delete20Regular,
  Key20Regular,
  MoreVertical16Regular,
  Share20Regular,
} from "@fluentui/react-icons";
import { ChildNodeInfo, NodeData } from "@/cryptree/types";

const fileTableTr = [
  { th: "Name", width: 55, mWidth: 300 },
  { th: "Owner", width: 12.5, mWidth: 100 },
  { th: "Data Modified", width: 12.5, mWidth: 100 },
  { th: "", width: 20, mWidth: 152 },
];

type NodeTableProps = {
  nodeData: NodeData;
  openNode: (name: string, cid: string, key: string) => void;
  download: (node: NodeData, cid: string) => void;
  shareButtonClick?: (childInfo: ChildNodeInfo) => void;
  deleteNode?: (cid: string) => void;
  reEncryptNode?: (cid: string) => void;
};

const NodeTable: FC<NodeTableProps> = ({
  nodeData,
  openNode,
  download,
  shareButtonClick,
  deleteNode,
  reEncryptNode,
}: NodeTableProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isSelectedId, setIsSelectedId] = useState<string>("");

  return (
    <>
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
          {nodeData?.children?.map((childNode: NodeData, i) => (
            <tr
              key={i}
              onClick={() => {
                setIsSelected(!isSelected);
                setIsSelectedId(nodeData.metadata.children[i].cid);
              }}
              onDoubleClick={() =>
                openNode(
                  childNode.metadata.name,
                  nodeData.metadata.children[i].cid,
                  childNode.subfolder_key
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
                {childNode.file_data && childNode.file_data.length > 0 ? (
                  <FileFormatIcon fileType="DocumentIcon" />
                ) : (
                  <FileFormatIcon fileType="FolderIcon" />
                )}
                <div>{childNode.metadata.name}</div>
              </td>
              <td style={{ width: `${fileTableTr[1].width}%` }}>
                {childNode.metadata.owner_id.slice(0, 6) +
                  "..." +
                  childNode.metadata.owner_id.slice(-4)}
              </td>
              <td style={{ width: `${fileTableTr[2].width}%` }}>
                {new Date(childNode.metadata.created_at).toLocaleDateString() +
                  " " +
                  new Date(childNode.metadata.created_at).toLocaleTimeString()}
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
                  <Button
                    layout="subtle"
                    headerVisible={true}
                    headerIcon={<ArrowDownload20Regular />}
                    labelVisible={false}
                    onClick={() =>
                      download(childNode, nodeData.metadata.children[i].cid)
                    }
                  />
                  {shareButtonClick && (
                    <Button
                      layout="subtle"
                      headerVisible={true}
                      headerIcon={<Share20Regular />}
                      labelVisible={false}
                      onClick={() =>
                        shareButtonClick(nodeData.metadata.children[i])
                      }
                    />
                  )}
                  {deleteNode && (
                    <Button
                      layout="subtle"
                      headerVisible={true}
                      headerIcon={<Delete20Regular />}
                      labelVisible={false}
                      onClick={() =>
                        deleteNode(nodeData.metadata.children[i].cid)
                      }
                    />
                  )}
                  {reEncryptNode && (
                    <Button
                      layout="subtle"
                      headerVisible={true}
                      headerIcon={<Key20Regular />}
                      labelVisible={false}
                      onClick={() =>
                        reEncryptNode(nodeData.metadata.children[i].cid)
                      }
                    />
                  )}
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
    </>
  );
};

export default NodeTable;
