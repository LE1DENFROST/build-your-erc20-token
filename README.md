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

📌 𝙋𝙧𝙤𝙟𝙚𝙘𝙩 𝙎𝙚𝙩𝙪𝙥 <br> <br>
The first step is to create your project directory and install the necessary packages.
```bash
mkdir rohan-token
cd rohan-token
npm init -y
npm install --save-dev hardhat @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan ethers
npm install @openzeppelin/contracts
```  
📌 𝐒𝐭𝐚𝐫𝐭𝐢𝐧𝐠 𝐭𝐡𝐞 𝐇𝐚𝐫𝐝𝐡𝐚𝐭 𝐏𝐫𝐨𝐣𝐞𝐜𝐭 <br><br>
Run the following command to start the Hardhat project. This command will help you create the Hardhat configuration files.
`npx hardhat`
After running the command, you will be presented with several options to set up the project. You can select “Create a basic sample project”. <br> <br>
📌 𝐁𝐮𝐢𝐥𝐝 𝐇𝐚𝐫𝐝𝐡𝐚𝐭 𝐏𝐫𝐨𝐣𝐞𝐜𝐭 <br> <br>
After writing your smart contracts, use the command below to compile your project. This step compiles the smart contracts you have written and checks for errors.
`npx hardhat compile`

📌 𝐖𝐫𝐢𝐭𝐢𝐧𝐠 𝐒𝐦𝐚𝐫𝐭 𝐂𝐨𝐧𝐭𝐫𝐚𝐜𝐭𝐬 <br> <br>
In our project, there will be two main smart contracts:

• RohanToken.sol: The ERC20 token contract. <br>
• RohanDex.sol: A DEX where you can trade the token with ETH. <br> <br>
Create the file contracts/RohanToken.sol and add the following code:
```RohanToken.sol
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

📌 𝐇𝐚𝐫𝐝𝐡𝐚𝐭 𝐂𝐨𝐧𝐟𝐢𝐠𝐮𝐫𝐚𝐭𝐢𝐨𝐧 <br><br>
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

📌 𝐃𝐞𝐩𝐥𝐨𝐲𝐢𝐧𝐠 𝐂𝐨𝐧𝐭𝐫𝐚𝐜𝐭𝐬 <br> <br>
The deploy.js script will be used to deploy the smart contracts to the Sepolia test network. Create the file scripts/deploy.js and add the following code:
```deploy.js

// scripts/deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const RohanToken = await ethers.getContractFactory("RohanToken");
    const RohanDex = await ethers.getContractFactory("RohanDex");

    // Token deploy
    const token = await RohanToken.deploy(deployer.address, { gasPrice, gasLimit });
    await token.deployed();
    console.log("Rohan Token deployed to:", token.address);

    // Dex deploy
    const rohanTokenAddress = token.address;
    const rohanDex = await RohanDex.deploy(rohanTokenAddress, { gasPrice, gasLimit });
    await rohanDex.deployed();
    console.log("Rohan Dex deployed to:", rohanDex.address);

     // define tokenAmount here
    const tokenAmount = ethers.utils.parseEther("1000000"); // 1 million tokens

    // Token confirmation
    const approvalTx = await token.approve(rohanDex.address, tokenAmount);
    await approvalTx.wait();
    console.log("token approval granted");

    // Adding liquidity
    try {
        const tx = await rohanDex.addLiquidity(tokenAmount, { 
            value: ethers.utils.parseEther("0.001"), // 0.001 ETH
            gasPrice, 
            gasLimit 
        });
        await tx.wait();
        console.log("Liquidity added");
    } catch (error) {
        console.error("error:", error);
    }

    // Token balance check
    const balance = await token.balanceOf(deployer.address);
    console.log("Token balancei:", ethers.utils.formatEther(balance));

    // ETH balance check
    const ethBalance = await deployer.getBalance();
    console.log("ETH balance:", ethers.utils.formatEther(ethBalance));
}

const gasPrice = ethers.utils.parseUnits('3', 'gwei');// An even lower gas price
const gasLimit = 2500000; // 2.5 million gas

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```
This script distributes RohanToken and RohanDex contracts, issues token confirmation and adds liquidity to the DEX. <br>
```bash
npx hardhat run scripts/deploy.js --network sepolia
```
Once the deployment is complete, you will see the addresses of the deployed contracts in the console output. <br><br>
📌 𝐕𝐞𝐫𝐢𝐟𝐲𝐢𝐧𝐠 𝐂𝐨𝐧𝐭𝐫𝐚𝐜𝐭𝐬 <br><br>
Verifying the deployed contracts on Etherscan makes the source code transparent and ensures trustworthiness. Create the file scripts/verify.js and add the following code: <br>
```verify.js
const hre = require("hardhat");

async function main() {
  const contractAddress = "your token address";
  const initialOwnerAddress = "the address you used to deploy the token"; 

  const contractArguments = [initialOwnerAddress];

  console.log("The RohanToken contract is being ratified.");
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: contractArguments,
    });
    console.log("RohanToken contract successfully approved!");
  } catch (error) {
    console.error("Error during confirmation:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```
To start the verification process, run the following command in your terminal: <br>
```bash
npx hardhat run scripts/verify.js --network sepolia
```
When the verification is successful, you will be able to view your contracts on Etherscan. <br><br>

📌 𝐈𝐧𝐭𝐞𝐫𝐚𝐜𝐭𝐢𝐧𝐠 𝐰𝐢𝐭𝐡 𝐭𝐡𝐞 𝐃𝐄𝐗 <br><br>
Create the file scripts/liqide.js and add the following code:
```liqide.js
const { Web3 } = require('web3');
const web3 = new Web3('https://sepolia.infura.io/v3/-your-infura-api');

const dexABI = [
    ]; // ABI of the DEX contract. You can find it in the artifacts folder.
const dexAddress = 'token dex address';
const dexContract = new web3.eth.Contract(dexABI, dexAddress);

const tokenABI = [
    ]; // ABI of the token contract. You can find it in the artifacts folder.
const tokenAddress = 'token contract address'; // Address of the token contract
const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);

async function checkLiquidity() {
    const reserveEth = await dexContract.methods.reserveEth().call();
    const reserveToken = await dexContract.methods.reserveToken().call();
    console.log('Mevcut likidite:', {
        ETH: web3.utils.fromWei(reserveEth, 'ether'),
        Token: web3.utils.fromWei(reserveToken, 'ether')
    });
    return { reserveEth, reserveToken };
}


async function addLiquidity(privateKey, ethAmount, tokenAmount) {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    try {
        console.log('Existing liquidity is being controlled...');
        const { reserveEth, reserveToken } = await checkLiquidity();

        if (reserveEth !== '0' && reserveToken !== '0') {
             // Calculate token amount based on available liquidity
            const requiredTokenAmount = BigInt(ethAmount) * BigInt(reserveToken) / BigInt(reserveEth);
            tokenAmount = requiredTokenAmount.toString();
            console.log('Required amount of tokens:', web3.utils.fromWei(tokenAmount, 'ether'));
        }

        console.log('Token approval is being given...');
        const approvalTx = await tokenContract.methods.approve(dexAddress, tokenAmount).send({ from: account.address });
        console.log('Token approval granted. Transaction hash:', approvalTx.transactionHash);

        console.log('Initiating the process of adding liquidity...');
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await dexContract.methods.addLiquidity(tokenAmount).estimateGas({
            from: account.address,
            value: ethAmount
        });

        console.log('Estimated gas:', gasEstimate);

        const tx = {
            from: account.address,
            to: dexAddress,
            gas: Math.floor(Number(gasEstimate) * 1.5),
            gasPrice: gasPrice,
            value: ethAmount,
            data: dexContract.methods.addLiquidity(tokenAmount).encodeABI()
        };

        console.log('The transaction is being signed...');
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        console.log('Sending the transaction...');
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        
        console.log('The process is successful:', receipt.transactionHash);
        console.log('Gas use:', receipt.gasUsed);
        console.log('Transaction status:', receipt.status ? 'Successful' : 'Failed');

        console.log('Updated liquidity is being checked...');
        await checkLiquidity();
    } catch (error) {
        console.error('Hata detayı:', error);
        if (error.receipt) {
            console.error('Transaction hash', error.receipt.transactionHash);
            console.error('Gas use:', error.receipt.gasUsed);
            console.error('Transaction status:', error.receipt.status ? 'Successful' : 'Failed');
        }
    }
}

// Usage
const privateKey = 'privatekey of metamask wallet';
const ethToAdd = web3.utils.toWei('0.15', 'ether');
let tokenToAdd = web3.utils.toWei('10', 'ether'); // This value will be automatically adjusted according to available liquidity

addLiquidity(privateKey, ethToAdd, tokenToAdd)
    .then(() => console.log('Transaction completed'))
    .catch((error) => console.error('General error:', error));
```
📌𝐀𝐝𝐝𝐢𝐧𝐠 𝐚𝐧𝐝 𝐂𝐡𝐞𝐜𝐤𝐢𝐧𝐠 𝐋𝐢𝐪𝐮𝐢𝐝𝐢𝐭𝐲 <br><br>
This script allows you to easily check the current liquidity of your DEX and add specific amounts of ETH and tokens. When adding liquidity, make sure to use your private key. Just a friendly reminder: never share your private key in real projects, and always keep it secure! <br><br>

📌 𝐂𝐨𝐧𝐜𝐥𝐮𝐬𝐢𝐨𝐧  <br><br>
In this guide, you’ve learned how to create your very own ERC20 token using Solidity and OpenZeppelin. You’ve also developed a decentralized exchange (DEX) to manage that token and deployed everything using Hardhat. Along the way, you covered how to verify your contracts on Etherscan and interact with your DEX. <br>

With this knowledge, you’re well on your way to starting your own crypto projects! <br>

Just a final note: remember that smart contracts are permanent. Any mistakes can lead to significant losses, so it’s crucial to conduct thorough testing and consider getting security audits before you deploy your contracts.







