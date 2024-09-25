const hre = require("hardhat");

async function main() {
  const contractAddress = "0x253bC3bfBd5A97d39D32745c553dB2FD3b3C5f3f"; // RohanToken'ın adresi
  const initialOwnerAddress = "0x612fc22E91176D019b79CF116CF6D3ea908Efd41"; // RohanToken'ı deploy ederken kullandığınız adres

  const contractArguments = [initialOwnerAddress];

  console.log("RohanToken sözleşmesi onaylanıyor...");
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: contractArguments,
    });
    console.log("RohanToken sözleşmesi başarıyla onaylandı!");
  } catch (error) {
    console.error("Onaylama sırasında hata oluştu:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });