async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(10);

  // Save copies of each contracts abi and address to the frontend.
  saveFrontendFiles(nft, "NFT");
}

function saveFrontendFiles(contract, name) {

  const path = require("path");
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "/../frontend/src/contracts")

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });