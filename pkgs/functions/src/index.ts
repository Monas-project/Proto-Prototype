import * as admin from "firebase-admin";
/* eslint-disable object-curly-spacing */
import { initializeApp } from "firebase-admin/app";
import {
  DatabaseEvent,
  DataSnapshot,
  onValueCreated,
} from "firebase-functions/v2/database";
/* eslint-disable object-curly-spacing */
import { Message } from "firebase-admin/lib/messaging/messaging-api";

initializeApp();

export const sendPushNotification = onValueCreated(
  "/messages/{messageId}",
  async (event: DatabaseEvent<DataSnapshot, { messageId: string }>) => {
    const snapshot = event.data;
    const message = snapshot.val();
    const messageId = event.params.messageId;

    console.log("New message added:", messageId, message);

    try {
      const receiverSnapshot = await admin
        .database()
        .ref(`/users/${message.receiver}/fcmToken`)
        .once("value");
      const receiverToken = receiverSnapshot.val();

      if (!receiverToken) {
        console.log("No FCM token found for receiver:", message.receiver);
        return null;
      }

      const payload: Message = {
        notification: {
          title: "New message",
          body: `${message.sender} sent you a message`,
        },
        token: receiverToken,
        data: {
          messageId: messageId,
          sender: message.sender,
        },
      };

      const response = await admin.messaging().send(payload);
      console.log("Notification sent successfully:", response);
      return response;
    } catch (error) {
      console.error("Error sending notification:", error);
      return null;
    }
  }
);
