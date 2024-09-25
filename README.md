✨ 𝐈𝐍𝐓𝐑𝐎𝐃𝐔𝐂𝐓𝐈𝐎𝐍 <br> <br>
Creating your own token in the world of crypto is an excellent step towards developing decentralized finance (DeFi) applications or simply learning more about blockchain technology. <br> In this guide, you’ll learn how to create an ERC20-compliant token, build a DEX to manage it, and deploy these smart contracts using Hardhat.

📌 𝙍𝙚𝙦𝙪𝙞𝙧𝙚𝙢𝙚𝙣𝙩𝙨 <br> <br>
Before starting the project, make sure you have the following tools and information:

• Node.js and npm: JavaScript runtime and package manager. <br>
• Hardhat: Ethereum development environment. <br>
• Git: Version control system. <br>
• Text Editor: Such as VSCode or similar. <br>
• Ethereum Wallet: MetaMask or similar. <br>
• Infura or Alchemy API Key: To interact with the Ethereum network. <br>
• Etherscan API KEY <br> <br>

Project Setup <br> <br>
The first step is to create your project directory and install the necessary packages.
```bash
mkdir rohan-token
cd rohan-token
npm init -y
npm install --save-dev hardhat @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan ethers
npm install @openzeppelin/contracts
```  

Writing Smart Contracts <br> <br>
In our project, there will be two main smart contracts:

• RohanToken.sol: The ERC20 token contract. <br>
• RohanDex.sol: A DEX where you can trade the token with ETH. <br> <br>
Create the file contracts/RohanToken.sol and add the following code:
```RohanToken.sol
mkdir rohan-token
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RohanToken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("write your own token name", "write your own symbol") Ownable(initialOwner) {
        // Minting 10 million tokens as total supply
        _mint(msg.sender, 10_000_000 * 10 ** decimals());
    }
}
```  
This contract creates a simple token using OpenZeppelin's ERC20 and Ownable contracts. It generates 10 million tokens with the name "your_Token_anme" and the symbol "your_Token_Symbol". <br> <br>

Create the file contracts/RohanDex.sol and add the following code:
 ```RohanDex.sol
  // contracts/RohanDex.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract RohanDex {
    using SafeERC20 for IERC20;

    IERC20 public token;
    uint256 public reserveEth;
    uint256 public reserveToken;
    uint256 public constant FEE_PERCENTAGE = 3; // 0.3% transaction fee (calculated over 1000)

    event LiquidityAdded(address indexed provider, uint256 ethAmount, uint256 tokenAmount);
    event LiquidityRemoved(address indexed provider, uint256 ethAmount, uint256 tokenAmount);
    event Swapped(address indexed swapper, uint256 ethAmountIn, uint256 tokenAmountOut);

    constructor(IERC20 _token) {
        token = _token;
    }

    // Using ETH to buy tokens
    function swapEthForTokens(uint256 minTokens) external payable {
        require(msg.value > 0, "Must send ETH");

        uint256 tokensOut = getAmountOut(msg.value, reserveEth, reserveToken);
        require(tokensOut >= minTokens, "Insufficient output amount");

        // Update liquidity
        reserveEth += msg.value;
        reserveToken -= tokensOut;

        // Send tokens to the user
        token.safeTransfer(msg.sender, tokensOut);

        emit Swapped(msg.sender, msg.value, tokensOut);
    }

     // Buying ETH with Token
    function swapTokensForEth(uint256 tokenAmount, uint256 minEth) external {
        require(tokenAmount > 0, "Must send tokens");

        uint256 ethOut = getAmountOut(tokenAmount, reserveToken, reserveEth);
        require(ethOut >= minEth, "Insufficient output amount");

        // Update liquidity
        reserveToken += tokenAmount;
        reserveEth -= ethOut;

        // Transfer tokens to the contract and send ETH to the user
        token.safeTransferFrom(msg.sender, address(this), tokenAmount);
        payable(msg.sender).transfer(ethOut);

        emit Swapped(msg.sender, ethOut, tokenAmount);
    }

    // Adding liquidity
    function addLiquidity(uint256 tokenAmount) external payable {
        require(msg.value > 0 && tokenAmount > 0, "Must provide ETH and tokens");

        // First liquidity addition
        if (reserveEth == 0 && reserveToken == 0) {
            reserveEth = msg.value;
            reserveToken = tokenAmount;
        } else {
            // Maintain rate
            uint256 requiredTokenAmount = (msg.value * reserveToken) / reserveEth;
            require(tokenAmount >= requiredTokenAmount, "Token amount insufficient for liquidity");

            reserveEth += msg.value;
            reserveToken += tokenAmount;
        }

        token.safeTransferFrom(msg.sender, address(this), tokenAmount);

        emit LiquidityAdded(msg.sender, msg.value, tokenAmount);
    }

    // Liquidity extraction
    function removeLiquidity(uint256 ethAmount) external {
        require(ethAmount > 0 && ethAmount <= reserveEth, "Invalid ETH amount");

        uint256 tokenAmount = (ethAmount * reserveToken) / reserveEth;

        reserveEth -= ethAmount;
        reserveToken -= tokenAmount;

         // Return ETH and Tokens to the user
        payable(msg.sender).transfer(ethAmount);
        token.safeTransfer(msg.sender, tokenAmount);

        emit LiquidityRemoved(msg.sender, ethAmount, tokenAmount);
    }

     // Price calculation for swap transaction (Uniswap style)
    function getAmountOut(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve) internal pure returns (uint256) {
        uint256 inputAmountWithFee = inputAmount * (1000 - FEE_PERCENTAGE);
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 1000) + inputAmountWithFee;
        return numerator / denominator;
    }

     // View liquidity ratios of the pool
    function getReserves() external view returns (uint256 ethReserve, uint256 tokenReserve) {
        return (reserveEth, reserveToken);
    }
}
```  
This contract provides basic DEX functionality. Users can trade tokens for ETH, and they can add or remove liquidity. You can further develop the liquidity functions based on your project needs. <br><br>

Hardhat Configuration <br><br>
Hardhat is a powerful development environment for compiling, testing, and deploying Ethereum smart contracts. Create the file hardhat.config.js and add the following code:
 ```hardhat.config.js
// ./hardhat.config.js
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
 ```
Explanation <br><br>
• This configuration file: <br>
• Specifies the Solidity version to use. <br>
• Configures the Sepolia test network. <br>
• Adds your Etherscan verification API key for contract verification. <br>
• Replace YOUR_INFURA_API_KEY with your actual Infura API key and YOUR_WALLET_PRIVATE_KEY with your wallet's private key (be cautious with your private key). Also, insert your Etherscan <br> 
• API key in the corresponding field. <br><br>







