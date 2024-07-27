import "dotenv/config";
import * as dotenv from "dotenv";

dotenv.config();
const baseUrl: string = process.env.CRYPTREE_API_URL || "http://localhost:8000";

export const getBox = async (
  accessToken: string,
  subfolder_key: string,
  cid: string
) => {
  if (!subfolder_key || !cid) return;
  try {
    const res = await fetch(`${baseUrl}/api/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        subfolder_key,
        cid,
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
