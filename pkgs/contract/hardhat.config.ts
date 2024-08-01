import { HardhatUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition-ethers";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import "@typechain/hardhat";
dotenv.config();

const { PRIVATE_KEY, GAS_REPORT, POLYGON_AMOY_RPC_URL } = process.env;

const HARDHAT_CHAINID = 31337;
const DEFAULT_BLOCK_GAS_LIMIT = 30000000;
const GWEI = 1000 * 1000 * 1000;

const SKIP_LOAD = process.env.SKIP_LOAD === "true";
if (!SKIP_LOAD) {
  const taskPaths = ["mock"];
  taskPaths.forEach((folder) => {
    const tasksPath = path.join(__dirname, "tasks", folder);
    fs.readdirSync(tasksPath)
      .filter((_path) => _path.includes(".ts"))
      .forEach((task) => {
        require(`${tasksPath}/${task}`);
      });
  });
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gas: DEFAULT_BLOCK_GAS_LIMIT,
      gasPrice: 3 * GWEI,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
    },
    polygonAmoy: {
      url: POLYGON_AMOY_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};

export default config;
