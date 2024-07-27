import "dotenv/config";
import * as dotenv from "dotenv";

dotenv.config();
const baseUrl: string = process.env.CRYPTREE_API_URL || "http://localhost:8000";

export const reEncryptNode = async (
  accessToken: string,
  target_cid: string,
  parent_subfolder_key: string,
  parent_cid: string,
  root_key: string
) => {
  if (!target_cid || !parent_subfolder_key || !parent_cid) return;
  try {
    const res = await fetch(`${baseUrl}/api/re-encrypt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        target_cid,
        parent_subfolder_key,
        parent_cid,
        root_key,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to Get Node");
    }

    const data = await res.json();

    return data;
  } catch (err) {
    console.error("err:", err);
  }
};
