const quais = require('quais')
const { deployMetadata } = require("hardhat");
require('dotenv').config()

// Contract artifacts
const HealthSecureIdentityJson = require('../artifacts/contracts/HealthSecureIdentity.sol/HealthSecureIdentity.json')
const MedicalRecordRegistryJson = require('../artifacts/contracts/MedicalRecordRegistry.sol/MedicalRecordRegistry.json')
const AccessControlJson = require('../artifacts/contracts/AccessControl.sol/AccessControl.json')

async function deployHealthSecure() {
    console.log("🚀 Starting HealthSecure contract deployment...\n");

    // Config provider, wallet, and contract factory
    const provider = new quais.JsonRpcProvider(hre.network.config.url, undefined, { usePathing: true })
    const wallet = new quais.Wallet(hre.network.config.accounts[0], provider)

    console.log('📍 Deploying from address:', wallet.address)

    // Deploy HealthSecureIdentity
    console.log('\n1️⃣  Deploying HealthSecureIdentity...')
    const ipfsHash1 = await deployMetadata.pushMetadataToIPFS("HealthSecureIdentity")
    const IdentityFactory = new quais.ContractFactory(
        HealthSecureIdentityJson.abi,
        HealthSecureIdentityJson.bytecode,
        wallet,
        ipfsHash1
    )

    const identityContract = await IdentityFactory.deploy()
    console.log('   📝 TX Hash:', identityContract.deploymentTransaction().hash)
    await identityContract.waitForDeployment()
    const identityAddress = await identityContract.getAddress()
    console.log('   ✅ Deployed to:', identityAddress)

    // Deploy MedicalRecordRegistry
    console.log('\n2️⃣  Deploying MedicalRecordRegistry...')
    const ipfsHash2 = await deployMetadata.pushMetadataToIPFS("MedicalRecordRegistry")
    const RecordFactory = new quais.ContractFactory(
        MedicalRecordRegistryJson.abi,
        MedicalRecordRegistryJson.bytecode,
        wallet,
        ipfsHash2
    )

    const recordRegistry = await RecordFactory.deploy(identityAddress)
    console.log('   📝 TX Hash:', recordRegistry.deploymentTransaction().hash)
    await recordRegistry.waitForDeployment()
    const recordAddress = await recordRegistry.getAddress()
    console.log('   ✅ Deployed to:', recordAddress)

    // Deploy AccessControl
    console.log('\n3️⃣  Deploying AccessControl...')
    const ipfsHash3 = await deployMetadata.pushMetadataToIPFS("AccessControl")
    const AccessFactory = new quais.ContractFactory(
        AccessControlJson.abi,
        AccessControlJson.bytecode,
        wallet,
        ipfsHash3
    )

    const accessControl = await AccessFactory.deploy(identityAddress)
    console.log('   📝 TX Hash:', accessControl.deploymentTransaction().hash)
    await accessControl.waitForDeployment()
    const accessAddress = await accessControl.getAddress()
    console.log('   ✅ Deployed to:', accessAddress)

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📋 DEPLOYMENT SUMMARY')
    console.log('='.repeat(60))
    console.log('\nContract Addresses:')
    console.log('  HealthSecureIdentity:', identityAddress)
    console.log('  MedicalRecordRegistry:', recordAddress)
    console.log('  AccessControl:', accessAddress)
    console.log('\nNetwork: Quai Orchard Testnet (Cyprus-1)')
    console.log('Chain ID: 15000')
    console.log('\n🎉 All contracts deployed successfully!')
    console.log('='.repeat(60))

    // Save deployment info
    const fs = require('fs')
    const deploymentInfo = {
        network: 'quaiOrchard',
        chainId: '15000',
        deployer: wallet.address,
        timestamp: new Date().toISOString(),
        contracts: {
            HealthSecureIdentity: identityAddress,
            MedicalRecordRegistry: recordAddress,
            AccessControl: accessAddress
        }
    }

    fs.writeFileSync('./deployments.json', JSON.stringify(deploymentInfo, null, 2))
    console.log('\n📁 Deployment info saved to deployments.json')
}

deployHealthSecure()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Deployment failed:', error)
        process.exit(1)
    })
