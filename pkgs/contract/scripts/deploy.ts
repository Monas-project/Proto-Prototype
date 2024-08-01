import { ethers, network } from "hardhat";
import { Wallet } from "ethers";
import { writeContractAddress } from "../helper/contractsJsonHelper";
import dotenv from "dotenv";
dotenv.config();

const rpcUrl = process.env.POLYGON_AMOY_RPC_URL as string;

async function main() {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const deployer = new Wallet(process.env.PRIVATE_KEY as string, provider);

  const RootIdStore = await ethers.getContractFactory("RootIdStore", deployer);
  const rootIdStore = await RootIdStore.deploy(await deployer.getAddress());

  await rootIdStore.waitForDeployment();
  console.log(`Contract deployed to '${await rootIdStore.getAddress()}'.\n`);

  // write Contract Address
  writeContractAddress({
    group: "contracts",
    name: "RootIdStore",
    value: rootIdStore.address,
    network: network.name,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
