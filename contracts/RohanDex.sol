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
