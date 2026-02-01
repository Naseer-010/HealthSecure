const quais = require('quais')
const MyContractJson = require('../artifacts/contracts/MyContract.sol/MyContract.json')
const { deployMetadata } = require("hardhat");
require('dotenv').config()

// Pull contract arguments from .env
//const tokenArgs = [process.env.ERC20_NAME, process.env.ERC20_SYMBOL, quais.parseUnits(process.env.ERC20_INITIALSUPPLY)]

async function deployMyContract() {
  // Config provider, wallet, and contract factory
  const provider = new quais.JsonRpcProvider(hre.network.config.url, undefined, { usePathing: true })
  const wallet = new quais.Wallet(hre.network.config.accounts[0], provider)
  const ipfsHash = await deployMetadata.pushMetadataToIPFS("MyContract")
  const MyContract = new quais.ContractFactory(MyContractJson.abi, MyContractJson.bytecode, wallet, ipfsHash)

  // Broadcast deploy transaction
  const MyContract_transaction = await MyContract.deploy()
  console.log('Transaction broadcasted: ', MyContract_transaction.deploymentTransaction().hash)

  // Wait for contract to be deployed
  await MyContract_transaction.waitForDeployment()
  console.log('Contract deployed to: ', await MyContract_transaction.getAddress())
}

deployMyContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
