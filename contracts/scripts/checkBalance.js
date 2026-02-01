const hre = require("hardhat");

async function main() {
    const [signer] = await hre.ethers.getSigners();
    console.log("Wallet Address:", signer.address);

    const balance = await hre.ethers.provider.getBalance(signer.address);
    console.log("Balance:", hre.ethers.formatEther(balance), "QUAI");

    if (balance === 0n) {
        console.log("\n⚠️  Your wallet has 0 QUAI!");
        console.log("Get testnet QUAI from: https://orchard.faucet.quai.network");
    }
}

main().catch(console.error);
