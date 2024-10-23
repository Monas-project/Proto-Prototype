import { GlobalContext } from "@/context/GlobalProvider";
import * as dotenv from "dotenv";
import "dotenv/config";
import { useContext, useEffect, useState } from "react";
import { useUserExists } from "./useUserExists";
import { addKey, setupIndexedDB } from "@/utils/keyManagement";
import { CryptoManager } from "@/utils/cryptoManager";
import { saveFcmToken } from "@/utils/firebase";

dotenv.config();

const baseUrl =
  process.env.NEXT_PUBLIC_CRYPTREE_API_URL || "http://localhost:3000";

export const useSignUp = (address: `0x${string}`, signature: `0x${string}`) => {
  const [data, setData] = useState(null);
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
    setupIndexedDB();
    const cryptoManager = new CryptoManager();
    const key = await cryptoManager.generateKey();
    const exportedKey = window.btoa(
      String.fromCharCode(...(await cryptoManager.exportKey(key)))
    );

    try {
      const body = JSON.stringify({
        name: "Root",
        owner_id: address,
        signature,
        key: exportedKey,
      });
      const res = await fetch(`${baseUrl}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

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
      const rootId = data?.root_node?.root_id;
      const rootKey = data?.root_node?.subfolder_key;

      addKey(address, rootKey, rootId);
      setData(data);
      setCurrentNodeCid(rootId);
      setCurrentNodeKey(rootKey);
      setRootId(rootId);
      setRootKey(rootKey);
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
    saveFcmToken(address);
  }, [userExistsData, accessToken]);

  return { signUp, data, loading, error };
};
