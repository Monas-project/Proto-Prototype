import React, { FC, useState } from "react";
import Checkboxes from "../Checkboxes/Checkboxes";
import { CopyButton } from "../Button/CopyButton";

export type NotificationListProps = {
  label: string;
  title: string;
  cid?: string;
  subfolderKey?: string;
  rootId?: string;
  timestamp?: number;
};

const NotificationList: FC<NotificationListProps> = ({
  label = "Label",
  title = "Title",
  cid = "cid",
  subfolderKey = "key",
  rootId = "rootId",
  timestamp = 0,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <>
      <li
        className={`group rounded-xl border-2 ${
          isChecked
            ? "bg-Neutral-Background-1-Pressed border-Neutral-Stroke-1-Pressed"
            : "bg-Neutral-Background-1-Rest hover:bg-Neutral-Background-1-Hover border-Neutral-Stroke-1-Rest hover:border-Neutral-Stroke-1-Hover"
        }`}
      >
        <div className="">
          <div
            className={`p-3 border-b ${
              isChecked
                ? "border-Neutral-Stroke-1-Pressed"
                : "border-Neutral-Stroke-1-Rest group-hover:border-Neutral-Stroke-1-Hover"
            }`}
          >
            {/* <Checkboxes
              label={
                timestamp
                  ? label + ` at ${new Date(timestamp).toLocaleString("ja-JP")}`
                  : label
              }
              isChecked={isChecked}
              onClick={() => setIsChecked(!isChecked)}
            /> */}
            <div>
              {label}
              {timestamp &&
                ` at ${new Date(timestamp).toLocaleString("ja-JP")}`}
            </div>
          </div>
          <div className=" space-y-2 pl-8 pr-6 py-3">
            <span className="block text-BodyLarge">{title}</span>
            <div className="flex flex-col space-y-1 text-BodySmall text-Neutral-Foreground-Variant-Rest">
              <span>
                cid: <CopyButton label={cid} content={cid} />
              </span>
              <span>
                key: <CopyButton label={subfolderKey} content={subfolderKey} />
              </span>
              <span>
                rootId:
                <CopyButton label={rootId} content={rootId} />
              </span>
            </div>
          </div>
        </div>
      </li>
    </>
  );
};

export default NotificationList;
