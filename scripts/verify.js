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
