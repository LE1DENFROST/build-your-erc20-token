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
