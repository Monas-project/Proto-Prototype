import "dotenv/config";
import * as dotenv from "dotenv";

dotenv.config();
const baseUrl: string = process.env.CRYPTREE_API_URL || "http://localhost:8000";

type CreateNodeResponse = {
  metadata: any;
  cid: any;
  subfolder_key: any;
  root_id: any;
};

export const createNode = async (accessToken: string, formData: FormData) => {
  if (!formData) return;
  try {
    const res = await fetch(`${baseUrl}/api/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
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
