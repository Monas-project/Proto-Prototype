import { GlobalContext } from "@/context/GlobalProvider";
import * as dotenv from "dotenv";
import "dotenv/config";
import { useContext, useEffect, useState } from "react";
import { useUserExists } from "./useUserExists";
import { addKey, getKey, setupIndexedDB } from "@/utils/keyManagement";
import { CryptoManager } from "@/utils/cryptoManager";

dotenv.config();

const baseUrl: string = process.env.CRYPTREE_API_URL || "http://localhost:8000";

export const useSignUp = (address: `0x${string}`, signature: `0x${string}`) => {
  const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {
    accessToken,
    setAccessToken,
    loading,
    setLoading,
    setRootId,
    setRootKey,
    setCurrentNodeCid,
    setCurrentNodeKey,
  } = useContext(GlobalContext);

  const { data: userExistsData, error: userExistsError } = useUserExists(
    address,
    signature
  );

  const signUp = async () => {
    if (!address || !signature) return;

    setLoading(true);
    let subfolderKey: string = "";
    try {
      setupIndexedDB();
      const cryptoManager = new CryptoManager();
      const key = await cryptoManager.generateKey();
      const exportedKey = window.btoa(
        String.fromCharCode(...(await cryptoManager.exportKey(key)))
      );

      const res = await addKey(address, exportedKey);
      subfolderKey = res.secretKey;
    } catch (err) {
      console.error("err:", err);
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    }

    if (!subfolderKey) {
      setLoading(false);
      return;
    }

    try {
      const body = JSON.stringify({
        name: "Root",
        owner_id: address,
        signature,
        key: subfolderKey,
      });
      console.log("owner_id:", address);
      console.log("signature:", signature);
      const res = await fetch(`${baseUrl}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      console.log("res:", res);
      console.log("res.status:", res.status);

      const data = await res.json();

      if (res.status === 400 && data.detail === "User already exists") {
        throw new Error(data.detail);
      } else if (!res.ok) {
        console.error("err:", data);
        throw new Error("Failed to signup");
      }

      if (data.access_token) {
        setAccessToken(data.access_token);
      }

      setData(data);
      setCurrentNodeCid(data?.root_node?.root_id);
      setCurrentNodeKey(data?.root_node?.subfolder_key);
      setRootId(data?.root_node?.root_id);
      setRootKey(data?.root_node?.subfolder_key);
    } catch (err) {
      console.error("err:", err);
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userExistsData?.exists) {
      return;
    }
    console.log("useEffect: useSignUp");
    signUp();
  }, [userExistsData, accessToken]);

  return { signUp, data, loading, error };
};
