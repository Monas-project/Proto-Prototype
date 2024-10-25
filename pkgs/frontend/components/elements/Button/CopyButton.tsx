"use client";
import { Copy16Regular } from "@fluentui/react-icons";
import Button from "./Button";
import { toast, ToastContainer } from "react-toastify";

type ClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

type CopyButtonProps = {
  label: string;
  content: string;
};

const CopyButton = ({ label, content }: CopyButtonProps) => {
  const copy = (e: ClickEvent, content: string) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(content);
      console.log("copy success");
      toast.success("Copy Success", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (e) {
      toast.error("Failed to copy", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.error(e);
    }
  };
  return (
    <>
      <Button
        layout={"transparent"}
        label={label}
        headerVisible={true}
        labelVisible={true}
        onClick={(e) => copy(e, content)}
        headerIcon={<Copy16Regular />}
      />
    </>
  );
};

export { CopyButton };
