import "dotenv/config";
import * as dotenv from "dotenv";

dotenv.config();
const baseUrl: string = process.env.CRYPTREE_API_URL || "http://localhost:8000";

export const deleteNode = async (accessToken: string, formData: FormData) => {
  if (!formData) return;
  try {
    const res = await fetch(`${baseUrl}/api/delete`, {
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
