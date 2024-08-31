import Button from '@/components/elements/Button/Button';
import FileFormatIcon from '@/components/elements/FileFormatIcon/FileFormatIcon';
import { ArrowDownload20Regular, Delete20Regular, Key20Regular, MoreVertical16Regular, Share20Regular } from '@fluentui/react-icons';
import React, { FC, MouseEventHandler, ReactNode, useState } from 'react';

export type FileListProps = {
}

const FileList: FC<FileListProps> =
    ({
    }) => {

        const [isSelected, setIsSelected] = useState<boolean>(false);
        const fileTableTr = [
            { th: "Name", width: 55, mWidth: 300 },
            { th: "Owner", width: 12.5, mWidth: 100 },
            { th: "Data Modified", width: 12.5, mWidth: 100 },
            { th: "", width: 20, mWidth: 152 },
        ];

        return (
            <div className="grow rounded-lg px-6 bg-Neutral-Background-1-Rest">
                <table className="w-full">

                    <thead className="border-b border-Neutral-Stroke-1-Rest text-TitleSmall text-Neutral-Foreground-Variant-Rest">
                        <tr className="w-full h-fit flex flex-row space-x-8 px-6 py-4 text-left [&_th]:p-0 [&_th]:font-medium">
                            {fileTableTr.map((x) => (
                                <th key={x.th} style={{ width: `${x.width}%`, minWidth: `${x.mWidth}px` }}>
                                    {x.th}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="flex flex-col w-full last:[&>tr]:border-none">
                        <tr onClick={() => { }}
                            className={`w-full flex flex-row px-6 py-2.5 space-x-8 border-b border-Neutral-Stroke-1-Rest text-BodyLarge items-center group 
                                    ${isSelected ? "bg-Neutral-Background-1-Pressed" : "bg-Neutral-Background-1-Rest hover:bg-Neutral-Background-1-Hover"} [&>td]:flex [&>td]:p-0`}>
                            <td
                                style={{ width: `${fileTableTr[0].width}%` }}
                                className="flex flex-row items-center space-x-6"
                            >

                                <FileFormatIcon fileType='DocumentIcon' />
                                <div className="ml-4">aaaaaaaaaa</div>
                            </td>
                            <td style={{ width: `${fileTableTr[1].width}%` }}>
                                owner
                            </td>
                            <td style={{ width: `${fileTableTr[2].width}%` }}>
                                datamodified
                            </td>
                            <td style={{ width: `${fileTableTr[3].width}%` }} className="space-x-5 justify-end items-center">
                                <div className={`space-x-3 flex flex-row group-hover:flex ${isSelected ? "flex" : "hidden"}`}>
                                    <Button
                                        layout="subtle"
                                        headerVisible={true}
                                        headerIcon={<ArrowDownload20Regular />}
                                        labelVisible={false}
                                    ></Button>
                                    <Button
                                        layout="subtle"
                                        headerVisible={true}
                                        headerIcon={<Share20Regular />}
                                        labelVisible={false}
                                    />
                                    <Button
                                        layout="subtle"
                                        headerVisible={true}
                                        headerIcon={<Delete20Regular />}
                                        labelVisible={false}
                                    />
                                    <Button
                                        layout="subtle"
                                        headerVisible={true}
                                        headerIcon={<Key20Regular />}
                                        labelVisible={false}
                                    />
                                </div>
                                <Button
                                    layout="subtle"
                                    headerVisible={true}
                                    headerIcon={<MoreVertical16Regular />}
                                    labelVisible={false}
                                ></Button>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

export default FileList;
