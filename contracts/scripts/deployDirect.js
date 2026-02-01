/**
 * Deploy contracts using direct fetch to Quai RPC
 * This bypasses SDK issues with Quai Network
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const RPC_URL = process.env.QUAI_RPC_URL || "https://orchard.rpc.quai.network/cyprus1";
const PRIVATE_KEY = process.env.PRIVATE_KEY.startsWith("0x")
    ? process.env.PRIVATE_KEY.slice(2)
    : process.env.PRIVATE_KEY;

// Use ethers for local signing, but manual RPC calls
const { ethers } = require("ethers");

// Read compiled artifacts
function getArtifact(contractName) {
    const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", `${contractName}.sol`, `${contractName}.json`);
    return JSON.parse(fs.readFileSync(artifactPath, "utf8"));
}

async function rpcCall(method, params) {
    const response = await fetch(RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method,
            params,
            id: 1
        })
    });
    const data = await response.json();
    if (data.error) {
        throw new Error(`RPC Error: ${data.error.message}`);
    }
    return data.result;
}

async function getBalance(address) {
    return rpcCall("eth_getBalance", [address, "latest"]);
}

async function getTransactionCount(address) {
    return rpcCall("eth_getTransactionCount", [address, "latest"]);
}

async function getGasPrice() {
    return rpcCall("eth_gasPrice", []);
}

async function getChainId() {
    return rpcCall("eth_chainId", []);
}

async function sendRawTransaction(signedTx) {
    return rpcCall("eth_sendRawTransaction", [signedTx]);
}

async function getTransactionReceipt(txHash) {
    return rpcCall("eth_getTransactionReceipt", [txHash]);
}

async function waitForReceipt(txHash, maxAttempts = 60) {
    for (let i = 0; i < maxAttempts; i++) {
        const receipt = await getTransactionReceipt(txHash);
        if (receipt) return receipt;
        await new Promise(r => setTimeout(r, 2000));
        process.stdout.write(".");
    }
    throw new Error("Transaction not mined");
}

async function deployContract(wallet, bytecode, constructorArgs = []) {
    const nonce = await getTransactionCount(wallet.address);
    const gasPrice = await getGasPrice();
    const chainId = await getChainId();

    // Encode constructor args if any
    let data = bytecode;
    if (constructorArgs.length > 0) {
        const abiCoder = ethers.AbiCoder.defaultAbiCoder();
        const encodedArgs = abiCoder.encode(
            constructorArgs.map(() => "address"),
            constructorArgs
        ).slice(2);
        data = bytecode + encodedArgs;
    }

    const tx = {
        nonce: parseInt(nonce, 16),
        gasPrice: BigInt(gasPrice),
        gasLimit: 5000000n,
        to: null,
        value: 0n,
        data: data,
        chainId: parseInt(chainId, 16)
    };

    const signedTx = await wallet.signTransaction(tx);
    const txHash = await sendRawTransaction(signedTx);
    console.log("   📝 TX Hash:", txHash);

    process.stdout.write("   ⏳ Waiting for confirmation");
    const receipt = await waitForReceipt(txHash);
    console.log(" ✓");

    return receipt.contractAddress;
}

async function main() {
    console.log("🚀 Starting HealthSecure contract deployment...\n");

    // Create wallet
    const wallet = new ethers.Wallet(PRIVATE_KEY);
    console.log("📍 Deploying contracts with account:", wallet.address);

    // Check balance
    const balance = await getBalance(wallet.address);
    const balanceEth = ethers.formatEther(BigInt(balance));
    console.log("💰 Account balance:", balanceEth, "QUAI\n");

    if (BigInt(balance) === 0n) {
        console.log("❌ No QUAI balance!");
        process.exit(1);
    }

    // Get chain ID
    const chainId = await getChainId();
    console.log("🔗 Chain ID:", parseInt(chainId, 16), "\n");

    // Deploy HealthSecureIdentity
    console.log("1️⃣  Deploying HealthSecureIdentity...");
    const identityArtifact = getArtifact("HealthSecureIdentity");
    const identityAddress = await deployContract(wallet, identityArtifact.bytecode);
    console.log("   ✅ Deployed to:", identityAddress);

    // Deploy MedicalRecordRegistry
    console.log("\n2️⃣  Deploying MedicalRecordRegistry...");
    const recordArtifact = getArtifact("MedicalRecordRegistry");
    const recordAddress = await deployContract(wallet, recordArtifact.bytecode, [identityAddress]);
    console.log("   ✅ Deployed to:", recordAddress);

    // Deploy AccessControl
    console.log("\n3️⃣  Deploying AccessControl...");
    const accessArtifact = getArtifact("AccessControl");
    const accessAddress = await deployContract(wallet, accessArtifact.bytecode, [identityAddress]);
    console.log("   ✅ Deployed to:", accessAddress);

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("📋 DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));
    console.log("\nContract Addresses:");
    console.log("  HealthSecureIdentity:", identityAddress);
    console.log("  MedicalRecordRegistry:", recordAddress);
    console.log("  AccessControl:", accessAddress);
    console.log("\nNetwork: Quai Orchard Testnet");
    console.log("Chain ID:", parseInt(chainId, 16));
    console.log("\n🎉 All contracts deployed successfully!");
    console.log("=".repeat(60));

    // Save deployment info
    const deploymentInfo = {
        network: "quaiOrchard",
        chainId: parseInt(chainId, 16).toString(),
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
        console.error("❌ Deployment failed:", error.message);
        console.error(error.stack);
        process.exit(1);
    });
