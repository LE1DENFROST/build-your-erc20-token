require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/c35decbfada24d1498e166a9e4170c9b", // Alchemy veya Infura API key
      accounts: [`0x${"4776901c3336f1d87e0f0bd51106fe1524e3350b4fc06b63c89f1356102dd08b"}`], // Cüzdan özel anahtarın
    },
  },
  etherscan: {
    apiKey: "R4VHNWZ8W8EMYCRWYSR9NFGHCJF97BC2TD", // Etherscan API key
  },
};
