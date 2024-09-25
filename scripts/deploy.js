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

    // tokenAmount'u burada tanımlayın
    const tokenAmount = ethers.utils.parseEther("1000000"); // 1 milyon token

    // Token onayı
    const approvalTx = await token.approve(rohanDex.address, tokenAmount);
    await approvalTx.wait();
    console.log("Token onayı verildi");

    // Likidite ekleme
    try {
        const tx = await rohanDex.addLiquidity(tokenAmount, { 
            value: ethers.utils.parseEther("0.001"), // 0.001 ETH
            gasPrice, 
            gasLimit 
        });
        await tx.wait();
        console.log("Likidite eklendi");
    } catch (error) {
        console.error("Hata:", error);
    }

    // Token bakiyesi kontrolü
    const balance = await token.balanceOf(deployer.address);
    console.log("Token bakiyesi:", ethers.utils.formatEther(balance));

    // ETH bakiyesi kontrolü
    const ethBalance = await deployer.getBalance();
    console.log("ETH bakiyesi:", ethers.utils.formatEther(ethBalance));
}

const gasPrice = ethers.utils.parseUnits('3', 'gwei'); // Daha da düşük bir gaz fiyatı
const gasLimit = 2500000; // 2.5 milyon gaz

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
