require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "", // Alchemy or Infura API key
      accounts: [`0x${"---"}`], // Wallet private key
    },
  },
  etherscan: {
    apiKey: "----", // Etherscan API key
  },
};
