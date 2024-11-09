interface ShareCode {
  cid: string;
  subfolderKey: string;
}

export const decode = (data: string): ShareCode => {
  return JSON.parse(atob(data));
};

export const encode = (shareCode: ShareCode): string => {
  return btoa(JSON.stringify(shareCode));
};
