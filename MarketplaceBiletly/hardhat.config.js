require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers"); //nuevo
const Dotenv = require('dotenv-webpack');

// const fs = require('fs')
// const privateKey = fs.readFileSync(".secret").toString().trim();

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
  defaultNetwork: "ganache",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545"
    },
    // polygon: {
    //   url: "https://rpc-mumbai.maticvigil.com/v1/99a99d15ac2ad3b526aa97401fdbe30ee724ba38",
    //   accounts: [privateKey]
    // },
    // hardhat: {
    // },
  },
  images:{
    // domains: ["<subdomain>.infura-ipfs.io", "infura-ipfs.io"]
    domains: ["infura-ipfs.io"]
  },
  plugins:[
    new Dotenv()
  ]
};