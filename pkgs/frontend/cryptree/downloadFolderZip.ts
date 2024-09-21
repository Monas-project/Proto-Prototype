import "dotenv/config";
import * as dotenv from "dotenv";

dotenv.config();

const baseUrl =
  process.env.NEXT_PUBLIC_CRYPTREE_API_URL || "http://localhost:3000";

export const downloadFolderZip = async (
  accessToken: string,
  cid: string,
  subfolder_key: string
) => {
  if (!cid || !subfolder_key) return;
  try {
    const res = await fetch(`${baseUrl}/api/download-folder`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cid,
        subfolder_key,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to Download Folder");
    }

    const contentDisposition = res.headers.get("Content-Disposition");
    let fileName = "download.zip";

    if (contentDisposition) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches != null && matches[1]) {
        fileName = matches[1].replace(/['"]/g, "");
      }

      // UTF-8エンコードされたファイル名の処理
      const filenameStarRegex = /filename\*=UTF-8''(.+)/i;
      const starMatches = filenameStarRegex.exec(contentDisposition);
      if (starMatches != null && starMatches[1]) {
        fileName = decodeURIComponent(starMatches[1]);
      }
    }

    // レスポンスをBlobとして取得
    const blob = await res.blob();

    // Blobオブジェクトを使用してダウンロードリンクを作成
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    // リンクをクリックしてダウンロードを開始
    document.body.appendChild(link);
    link.click();

    // クリーンアップ
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, message: "Download started" };
  } catch (err) {
    console.error("err:", err);
  }
};
