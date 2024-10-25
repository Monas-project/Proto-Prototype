// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { firebaseConfig } from "../firebase-config";
// import {
//   getDatabase,
//   ref,
//   set,
//   push,
//   onChildAdded,
//   query,
//   orderByChild,
//   equalTo,
//   onValue,
//   get,
//   IteratedDataSnapshot,
// } from "firebase/database";
// import {
//   getMessaging,
//   getToken,
//   MessagePayload,
//   Messaging,
//   onMessage,
// } from "firebase/messaging";
import { Address } from "viem";

// export const firebaseApp = initializeApp(firebaseConfig);
// export const firebaseAuth = getAuth(firebaseApp);
// export const firebaseRtDb = getDatabase(firebaseApp);
export let firebaseMessaging: any;

// クライアントサイドでのみ Messaging を初期化
if (typeof window !== "undefined") {
  // firebaseMessaging = getMessaging(firebaseApp);
}

export const getFcmToken = async (address: Address) => {
  // try {
  //   // ユーザーのFCMトークンを取得
  //   const snapshot = await get(ref(firebaseRtDb, `users/${address}/fcmToken`));
  //   console.log("snapshot:", snapshot.val());
  //   return snapshot.val() as string;
  // } catch (error) {
  //   console.error("FCMトークンの取得に失敗しました:", error);
  // }
};

export const saveFcmToken = async (address: `0x${string}`) => {
  // try {
  //   console.log("FCMトークンを保存します");
  //   const permission = await Notification.requestPermission();
  //   console.log("permission:", permission);
  //   if (permission === "granted" && address) {
  //     const existingToken = await getFcmToken(address);
  //     if (existingToken) {
  //       console.log("FCMトークンは既に保存されています");
  //       return;
  //     }
  //     const token = await getToken(firebaseMessaging, {
  //       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID_KEY,
  //     });
  //     if (!token) {
  //       console.error("FCMトークンが取得できませんでした");
  //       return;
  //     }
  //     await set(ref(firebaseRtDb, `users/${address}/fcmToken`), token);
  //     setupMessageListener();
  //     console.log("FCMトークンが保存されました");
  //   }
  // } catch (error) {
  //   console.error("FCMトークンの保存に失敗しました:", error);
  // }
};

export interface Message {
  sender: Address;
  receiver: Address;
  cid: string;
  key: string;
  rootId: string;
  content: string;
  timestamp: number;
}

// メッセージの送信関数
export const sendMessage = async (
  sender: Address,
  receiver: Address,
  cid: string,
  key: string,
  rootId: string,
  content: string = "Shared CID, Key, and Root ID (test mode)"
) => {
  // const messagesRef = ref(firebaseRtDb, "messages");
  // // pushを使用して一意のキーを生成
  // const newMessageRef = push(messagesRef);
  // const message: Message = {
  //   sender,
  //   receiver,
  //   cid,
  //   key,
  //   rootId,
  //   content,
  //   timestamp: Date.now(),
  // };
  // // 生成されたキーの下にメッセージデータをセット
  // await set(newMessageRef, message);
};

// 特定の送信者のメッセージを取得する関数
export const getMessagesBySender = async (sender: Address) => {
  // const messagesRef = ref(firebaseRtDb, "messages");
  // const senderQuery = query(
  //   messagesRef,
  //   orderByChild("sender"),
  //   equalTo(sender)
  // );
  // const snapshot = await get(senderQuery);
  // const messages: Message[] = [];
  // snapshot.forEach((childSnapshot: IteratedDataSnapshot) => {
  //   messages.push(childSnapshot.val() as Message);
  // });
  // return messages;
};

// 特定の受信者のメッセージを取得する関数
export const getMessagesByReceiver = async (receiver: Address) => {
  // const messagesRef = ref(firebaseRtDb, "messages");
  // const receiverQuery = query(
  //   messagesRef,
  //   orderByChild("receiver"),
  //   equalTo(receiver)
  // );
  // const snapshot = await get(receiverQuery);
  // const messages: Message[] = [];
  // snapshot.forEach((childSnapshot: IteratedDataSnapshot) => {
  //   messages.push(childSnapshot.val() as Message);
  // });
  // return messages;
};

export function setupMessageListener() {
  // onMessage(firebaseMessaging, (payload: MessagePayload) => {
  //   console.log("メッセージを受信しました:", payload);
  //   // ここで受信したメッセージを処理します（例: 通知を表示する）
  //   // 例:
  //   new Notification(payload?.notification?.title!, {
  //     body: payload?.notification?.body,
  //     icon: "/favicon.ico",
  //   });
  // });
}

export async function initializeFirebaseMessaging() {
  // const token = await Notification.requestPermission();
  // if (token) {
  //   setupMessageListener();
  // }
}
