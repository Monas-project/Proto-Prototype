export class CryptoManager {
  private algorithm: AesKeyGenParams = {
    name: "AES-GCM",
    length: 256,
  };

  async generateKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(this.algorithm, true, [
      "encrypt",
      "decrypt",
    ]);
  }

  async encrypt(
    key: CryptoKey,
    data: string
  ): Promise<{ iv: number[]; encryptedData: number[] }> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);

    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: this.algorithm.name,
        iv: iv,
      },
      key,
      encodedData
    );

    return {
      iv: Array.from(iv),
      encryptedData: Array.from(new Uint8Array(encryptedContent)),
    };
  }

  async decrypt(
    key: CryptoKey,
    encryptedData: number[],
    iv: number[]
  ): Promise<string> {
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: this.algorithm.name,
        iv: new Uint8Array(iv),
      },
      key,
      new Uint8Array(encryptedData)
    );

    return new TextDecoder().decode(decryptedContent);
  }

  async exportKey(key: CryptoKey): Promise<number[]> {
    const exportedKey = await window.crypto.subtle.exportKey("raw", key);
    console.log("exportedKey:", exportedKey);
    return Array.from(new Uint8Array(exportedKey));
  }

  async importKey(keyData: number[]): Promise<CryptoKey> {
    return await window.crypto.subtle.importKey(
      "raw",
      new Uint8Array(keyData),
      this.algorithm,
      true,
      ["encrypt", "decrypt"]
    );
  }
}
