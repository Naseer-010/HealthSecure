/**
 * Deploy contracts using Quais SDK (Quai Network specific)
 * This bypasses Hardhat's ethers integration for Quai compatibility
 */
require("dotenv").config();
const { quais } = require("quais");
const fs = require("fs");
const path = require("path");

// Network configuration
const RPC_URL = process.env.QUAI_RPC_URL || "https://orchard.rpc.quai.network/cyprus1";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Read compiled artifacts
function getArtifact(contractName) {
    const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", `${contractName}.sol`, `${contractName}.json`);
    return JSON.parse(fs.readFileSync(artifactPath, "utf8"));
}

async function main() {
    console.log("🚀 Starting HealthSecure contract deployment with Quais SDK...\n");

    // Set up provider and wallet
    const provider = new quais.JsonRpcProvider(RPC_URL);
    const wallet = new quais.Wallet(PRIVATE_KEY, provider);

    console.log("📍 Deploying contracts with account:", wallet.address);

    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Account balance:", quais.formatEther(balance), "QUAI\n");

    if (balance === 0n) {
        console.log("❌ No QUAI balance! Get tokens from faucet.");
        process.exit(1);
    }

    // Deploy HealthSecureIdentity
    console.log("1️⃣  Deploying HealthSecureIdentity...");
    const identityArtifact = getArtifact("HealthSecureIdentity");
    const IdentityFactory = new quais.ContractFactory(
        identityArtifact.abi,
        identityArtifact.bytecode,
        wallet
    );

    const identityContract = await IdentityFactory.deploy();
    console.log("   ⏳ Waiting for transaction...");
    await identityContract.waitForDeployment();
    const identityAddress = await identityContract.getAddress();
    console.log("   ✅ HealthSecureIdentity deployed to:", identityAddress);

    // Deploy MedicalRecordRegistry
    console.log("\n2️⃣  Deploying MedicalRecordRegistry...");
    const recordArtifact = getArtifact("MedicalRecordRegistry");
    const RecordFactory = new quais.ContractFactory(
        recordArtifact.abi,
        recordArtifact.bytecode,
        wallet
    );

    const recordRegistry = await RecordFactory.deploy(identityAddress);
    console.log("   ⏳ Waiting for transaction...");
    await recordRegistry.waitForDeployment();
    const recordAddress = await recordRegistry.getAddress();
    console.log("   ✅ MedicalRecordRegistry deployed to:", recordAddress);

    // Deploy AccessControl
    console.log("\n3️⃣  Deploying AccessControl...");
    const accessArtifact = getArtifact("AccessControl");
    const AccessFactory = new quais.ContractFactory(
        accessArtifact.abi,
        accessArtifact.bytecode,
        wallet
    );

    const accessControl = await AccessFactory.deploy(identityAddress);
    console.log("   ⏳ Waiting for transaction...");
    await accessControl.waitForDeployment();
    const accessAddress = await accessControl.getAddress();
    console.log("   ✅ AccessControl deployed to:", accessAddress);

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("📋 DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));
    console.log("\nContract Addresses:");
    console.log("  HealthSecureIdentity:", identityAddress);
    console.log("  MedicalRecordRegistry:", recordAddress);
    console.log("  AccessControl:", accessAddress);
    console.log("\nNetwork: Quai Orchard Testnet");
    console.log("Chain ID: 15000");
    console.log("\n🎉 All contracts deployed successfully!");
    console.log("=".repeat(60));

    // Save deployment info
    const deploymentInfo = {
        network: "quaiOrchard",
        chainId: "15000",
        deployer: wallet.address,
        timestamp: new Date().toISOString(),
        contracts: {
            HealthSecureIdentity: identityAddress,
            MedicalRecordRegistry: recordAddress,
            AccessControl: accessAddress
        }
    };

    fs.writeFileSync(
        path.join(__dirname, "..", "deployments.json"),
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n📁 Deployment info saved to deployments.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
