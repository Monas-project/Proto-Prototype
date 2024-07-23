export function setupIndexedDB() {
  const request = indexedDB.open("KeyDatabase", 1);

  request.onupgradeneeded = function (event) {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    if (!db.objectStoreNames.contains("keys")) {
      // db.createObjectStore("keys", { keyPath: ["walletAddress", "cid"] });
      db.createObjectStore("keys", { keyPath: ["walletAddress"] });
    }
  };
  request.onerror = function (event) {
    const target = event.target as IDBOpenDBRequest;
    console.error("Database error", target.error);
  };
  request.onsuccess = function (event) {
    console.log("Database opened successfully");
  };
}

/*
Add key operation
引数
- key: string
*/
// export function addKey(walletAddress: string, cid: string, secretKey: string) {
// export function addKey(walletAddress: string, secretKey: string) {
//   const request = indexedDB.open("KeyDatabase", 1);

//   request.onsuccess = function (event) {
//     const target = event.target as IDBOpenDBRequest;
//     const db = target.result;
//     const transaction = db.transaction(["keys"], "readwrite");
//     const store = transaction.objectStore("keys");

//     const getRequest = store.get([walletAddress]);

//     getRequest.onsuccess = function (event) {
//       const result = (event.target as IDBRequest).result;

//       if (result) {
//         console.log("Record already exists, skipping addition:", result);
//         return;
//       }
//       const addRequest = store.add({
//         walletAddress: walletAddress,
//         // cid: cid,
//         secretKey: secretKey,
//       });

//       addRequest.onsuccess = function () {
//         console.log("Key added successfully");
//       };

//       addRequest.onerror = function (event) {
//         const target = event.target as IDBRequest;
//         console.error("Add request error:", target.error);
//       };
//     };

//     getRequest.onerror = function (event) {
//       const target = event.target as IDBRequest;
//       console.error("Get request error:", target.error);
//     };

//     transaction.onerror = function (event) {
//       const target = event.target as IDBRequest;
//       console.error("Transaction error:", target.error);
//     };
//   };

//   request.onerror = function (event) {
//     const target = event.target as IDBRequest;
//     console.error("Database error:", target.error);
//   };
// }

type AddKeyResponse = {
  walletAddress: string;
  secretKey: string;
  cid?: string;
};

export function addKey(
  walletAddress: string,
  secretKey: string,
  cid?: string
): Promise<AddKeyResponse> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("KeyDatabase", 1);

    request.onsuccess = function (event) {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result;
      const transaction = db.transaction(["keys"], "readwrite");
      const store = transaction.objectStore("keys");

      const getRequest = store.get([walletAddress]);

      getRequest.onsuccess = function (event) {
        const result = (event.target as IDBRequest).result;

        if (result) {
          console.log("Record already exists, skipping addition:", result);
          resolve(result);
          return;
        }
        const addRequest = store.add({
          walletAddress: walletAddress,
          secretKey: secretKey,
          cid,
        });

        addRequest.onsuccess = function () {
          console.log("Key added successfully");
          resolve({ walletAddress, secretKey });
        };

        addRequest.onerror = function (event) {
          const target = event.target as IDBRequest;
          console.error("Add request error:", target.error);
          reject(target.error);
        };
      };

      getRequest.onerror = function (event) {
        const target = event.target as IDBRequest;
        console.error("Get request error:", target.error);
        reject(target.error);
      };

      transaction.onerror = function (event) {
        const target = event.target as IDBRequest;
        console.error("Transaction error:", target.error);
        reject(target.error);
      };
    };

    request.onerror = function (event) {
      const target = event.target as IDBRequest;
      console.error("Database error:", target.error);
      reject(target.error);
    };
  });
}

/*
Call key operation
引数
- id: number
return
- key: string?
*/

type GetKeyResponse = {
  walletAddress: string;
  secretKey: string;
  cid?: string;
};
export function getKey(walletAddress: string): Promise<GetKeyResponse> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("KeyDatabase", 1);

    request.onsuccess = function (event) {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result;
      const transaction = db.transaction(["keys"], "readonly");
      const store = transaction.objectStore("keys");
      const keyRequest = store.get([walletAddress]);

      keyRequest.onsuccess = function (event) {
        const target = event.target as IDBRequest;
        resolve(target.result);
      };

      keyRequest.onerror = function (event) {
        const target = event.target as IDBRequest;
        console.error("Key retrieval error:", target.error);
        reject(target.error);
      };
    };

    request.onerror = function (event) {
      const target = event.target as IDBOpenDBRequest;
      console.error("Database error:", target.error);
      reject(target.error);
    };
  });
}

/*
Delete key operation
引数
- id: number
*/
export function deleteKey(walletAddress: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("KeyDatabase", 1);

    request.onsuccess = function (event) {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result;
      const transaction = db.transaction(["keys"], "readwrite");
      const store = transaction.objectStore("keys");
      const deleteRequest = store.delete([walletAddress]);

      transaction.oncomplete = function () {
        console.log("Key deleted successfully");
        resolve();
      };

      transaction.onerror = function (event) {
        const target = event.target as IDBTransaction;
        console.error("Transaction error:", target.error);
        reject(target.error);
      };

      deleteRequest.onerror = function (event) {
        const target = event.target as IDBRequest;
        console.error("Delete request error:", target.error);
        reject(target.error);
      };
    };

    request.onerror = function (event) {
      const target = event.target as IDBOpenDBRequest;
      console.error("Database error:", target.error);
      reject(target.error);
    };
  });
}
