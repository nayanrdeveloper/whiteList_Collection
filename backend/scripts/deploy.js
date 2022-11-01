const hre = require("hardhat");

async function main() {
 
  const WhiteList = await hre.ethers.getContractFactory("WhiteList");
  const whiteList = await WhiteList.deploy(10);

  await whiteList.deployed();

  console.log(
    `Whitelist Deployed to deployed to ${whiteList.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
