import React, { useRef, useState } from "react";
import Button from "../Button/Button";
import Dialog from "../Dialog/Dialog";
import { Dismiss20Regular } from "@fluentui/react-icons";
import FileFormatIcon from "../FileFormatIcon/FileFormatIcon";
import ProgressBar from "../ProgressBar/ProgressBar";
import { Player } from "@lottiefiles/react-lottie-player";
import uploadFileIcon from "@/public/icons/uploadFileIcon.json";

// Propsの型定義

function formatFileSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}
interface FileUploadProps {
  onFileSelect: (file: File) => void; // ファイル選択時のコールバック関数
  uploadFile: (file: File | null) => Promise<void>; // ファイルアップロード時のコールバック関数
  close?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  uploadFile,
  close,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFileIconRef = useRef<Player | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
      onFileSelect(file); // 親コンポーネントにファイルを渡す
    }
  };

  const uploadingFile = async () => {
    await uploadFile(selectedFile);
  };

  const handleUploadFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    uploadFileIconRef.current?.play();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isDragging) {
      uploadFileIconRef.current?.stop();
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files ? event.dataTransfer.files[0] : null;
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
    setIsDragging(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    uploadFileIconRef.current?.play();
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    if (!isHovered) {
      uploadFileIconRef.current?.stop();
    }
  };

  return (
    <>
      <Dialog
        primaryButtonProps={{
          label: "Upload",
          onClick: uploadingFile,
          disabled: !selectedFile,
        }}
        secondaryButtonProps={{ label: "Close", onClick: close }}
      >
        <div className="py-6 text-center">
          <span className="text-TitleLarge text-Neutral-Foreground-1-Rest">
            Upload File
          </span>
        </div>
        <div className="space-y-4">
          <div
            onClick={handleUploadFile}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className={`w-[500px] h-60 rounded flex flex-col flex-wrap items-center place-content-center bg-Neutral-Background-2-Rest
            border border-dashed border-Neutral-Stroke-2-Rest hover:border-Primary-Stroke-Compound-Rest
            ${
              isHovered || (isDragging && "border-Primary-Stroke-Compound-Rest")
            }`}
          >
            <div className={`${isDragging && "pointer-events-none"}`}>
              <Player
                ref={uploadFileIconRef}
                renderer="svg"
                loop
                src={uploadFileIcon}
                style={{ height: "100px" }}
              />
            </div>

            <div
              className={`${
                isDragging && "pointer-events-none"
              } flex flex-col text-center text-Neutral-Foreground-1-Rest`}
            >
              <span className="text-BodyLarge">Drag & Drop Your File</span>
              <span className="text-BodySmall">
                or&ensp;
                <span
                  className="cursor-pointer text-Primary-Foreground-Link-Rest
                hover:text-Primary-Foreground-Link-Hover hover:underline hover:underline-offset-4 active:text-Primary-Foreground-Link-Pressed"
                >
                  Select a file
                </span>
                &ensp;from your computer
              </span>
            </div>
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          {selectedFile && (
            <div className="w-[500px] rounded flex flex-col space-y-0.5 p-1 bg-Neutral-Background-3-Rest">
              <div className="w-full flex flex-row space-x-2">
                <div className="w-full flex flex-row space-x-2">
                  <div className="p-1">
                    <FileFormatIcon fileType="DocumentIcon" />
                  </div>
                  <div className="w-full flex flex-col justify-center">
                    <p className="break-all text-LabelSmallProminent text-Neutral-Foreground-1-Rest">
                      選択されたファイル : {selectedFile.name}
                    </p>
                    <span className="text-BodySmall text-Neutral-Foreground-Variant-Rest">
                      サイズ : {formatFileSize(selectedFile.size)}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleDeleteFile}
                  layout="subtle"
                  headerVisible={true}
                  headerIcon={<Dismiss20Regular />}
                  labelVisible={false}
                />
              </div>
              {/* <div className="px-1">
                <ProgressBar width={50} />
              </div> */}
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default FileUpload;
