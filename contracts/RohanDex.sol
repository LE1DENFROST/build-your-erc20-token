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
    uint256 public constant FEE_PERCENTAGE = 3; // %0.3 işlem ücreti (1000 üzerinden hesaplanır)

    event LiquidityAdded(address indexed provider, uint256 ethAmount, uint256 tokenAmount);
    event LiquidityRemoved(address indexed provider, uint256 ethAmount, uint256 tokenAmount);
    event Swapped(address indexed swapper, uint256 ethAmountIn, uint256 tokenAmountOut);

    constructor(IERC20 _token) {
        token = _token;
    }

    // Token satın almak için ETH kullanma
    function swapEthForTokens(uint256 minTokens) external payable {
        require(msg.value > 0, "Must send ETH");

        uint256 tokensOut = getAmountOut(msg.value, reserveEth, reserveToken);
        require(tokensOut >= minTokens, "Insufficient output amount");

        // Likiditeyi güncelle
        reserveEth += msg.value;
        reserveToken -= tokensOut;

        // Tokenleri kullaniciya gönder
        token.safeTransfer(msg.sender, tokensOut);

        emit Swapped(msg.sender, msg.value, tokensOut);
    }

    // Token ile ETH satın alma
    function swapTokensForEth(uint256 tokenAmount, uint256 minEth) external {
        require(tokenAmount > 0, "Must send tokens");

        uint256 ethOut = getAmountOut(tokenAmount, reserveToken, reserveEth);
        require(ethOut >= minEth, "Insufficient output amount");

        // Likiditeyi güncelle
        reserveToken += tokenAmount;
        reserveEth -= ethOut;

        // Tokenleri kontrata transfer et ve ETH'yi kullaniciya gönder
        token.safeTransferFrom(msg.sender, address(this), tokenAmount);
        payable(msg.sender).transfer(ethOut);

        emit Swapped(msg.sender, ethOut, tokenAmount);
    }

    // Likidite ekleme
    function addLiquidity(uint256 tokenAmount) external payable {
        require(msg.value > 0 && tokenAmount > 0, "Must provide ETH and tokens");

        // İlk likidite ekleme
        if (reserveEth == 0 && reserveToken == 0) {
            reserveEth = msg.value;
            reserveToken = tokenAmount;
        } else {
            // Oranı koru
            uint256 requiredTokenAmount = (msg.value * reserveToken) / reserveEth;
            require(tokenAmount >= requiredTokenAmount, "Token amount insufficient for liquidity");

            reserveEth += msg.value;
            reserveToken += tokenAmount;
        }

        token.safeTransferFrom(msg.sender, address(this), tokenAmount);

        emit LiquidityAdded(msg.sender, msg.value, tokenAmount);
    }

    // Likidite çıkarma
    function removeLiquidity(uint256 ethAmount) external {
        require(ethAmount > 0 && ethAmount <= reserveEth, "Invalid ETH amount");

        uint256 tokenAmount = (ethAmount * reserveToken) / reserveEth;

        reserveEth -= ethAmount;
        reserveToken -= tokenAmount;

        // ETH ve Tokenleri kullanıcıya iade et
        payable(msg.sender).transfer(ethAmount);
        token.safeTransfer(msg.sender, tokenAmount);

        emit LiquidityRemoved(msg.sender, ethAmount, tokenAmount);
    }

    // Swap işlemi için fiyat hesaplaması (Uniswap tarzı)
    function getAmountOut(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve) internal pure returns (uint256) {
        uint256 inputAmountWithFee = inputAmount * (1000 - FEE_PERCENTAGE);
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 1000) + inputAmountWithFee;
        return numerator / denominator;
    }

    // Havuzun likidite oranlarını görüntüleme
    function getReserves() external view returns (uint256 ethReserve, uint256 tokenReserve) {
        return (reserveEth, reserveToken);
    }
}
