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
