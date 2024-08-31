import type { NextApiRequest, NextApiResponse } from "next";

export type ResponseData = {
  WALLET_CONNECT_PROJECT_ID: string;
  POLYGON_AMOY_RPC_URL: string;
  SECRET_MESSAGE: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const env: ResponseData = {
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID!,
    POLYGON_AMOY_RPC_URL: process.env.POLYGON_AMOY_RPC_URL!,
    SECRET_MESSAGE: process.env.SECRET_MESSAGE!,
  };

  res.status(200).json(env);
}
