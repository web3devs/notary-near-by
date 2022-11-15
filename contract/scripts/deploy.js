require('dotenv').config();
const hre = require("hardhat");

async function deployContract(contractName, deployerWallet) {
    const Contract = await hre.ethers.getContractFactory(contractName);
    const contractInstance = await Contract
        .connect(deployerWallet)
        .deploy();
    await contractInstance.deployed();
    return contractInstance
}

const registerContractAddressGasLimit = 1_000_000;
const transferOwnershipGasLimit = 3_000_000;

async function deployNotarizedDocumentNftContractAndInitialize(wallet, notaryContract) {
    console.log('Deploying NotarizedDocumentNft')
    const contract = await deployContract("NotarizedDocumentNft", wallet);
    console.log('setNotarizedDocumentNftContact')
    await (
        await notaryContract.setNotarizedDocumentNftContact(contract.address, {gasLimit: registerContractAddressGasLimit})
    ).wait()
    console.log('notarizedDocumentNftContract.transferOwnership')
    await (
        await contract.transferOwnership(notaryContract.address, {gasLimit: transferOwnershipGasLimit})
    ).wait()
    return contract;
}

async function deployNotaryNftContract(wallet, notaryContract) {
    console.log('Deploying NotaryNft')
    const contract = await deployContract("NotaryNft", wallet);
    console.log('setNotaryNftContract')
    await (
        await notaryContract.setNotaryNftContract(contract.address, {gasLimit: registerContractAddressGasLimit})
    ).wait()
    console.log('notaryNft.transferOwnership')
    await (
        await contract.transferOwnership(notaryContract.address, {gasLimit: transferOwnershipGasLimit})
    ).wait()
    return contract;
}

async function deployDocumentPermissionsNftContract(wallet, notaryContract) {
    console.log('Deploying DocumentPermissionNft')
    const contract = await deployContract("DocumentPermissionNft", wallet);
    console.log('setDocumentPermissionNftContract')
    await (
        await notaryContract.setDocumentPermissionNftContract(contract.address, {gasLimit: registerContractAddressGasLimit})
    ).wait()
    console.log('documentPermissionNft.transferOwnership')
    await (
        await contract.transferOwnership(notaryContract.address, {gasLimit: transferOwnershipGasLimit})
    ).wait()
    return contract;
}

async function deployContacts(wallet) {
    console.log(`Deploying contracts with ${wallet.address}`);

    const notaryContract = await deployContract("Notary", wallet);
    const notarizedDocumentNftContract = await deployNotarizedDocumentNftContractAndInitialize(wallet, notaryContract);
    const notaryNft = await deployNotaryNftContract(wallet, notaryContract);
    const documentPermissionNft = await deployDocumentPermissionsNftContract(wallet, notaryContract);

    return {notaryContract, notarizedDocumentNftContract, notaryNft, documentPermissionNft}
}

const main = async () => {
    const provider = hre.ethers.provider;
    const deployerWallet = new hre.ethers.Wallet(process.env.AURORA_PRIVATE_KEY, provider);
    return await deployContacts(deployerWallet);
}

if (require.main === module) {
    main()
        .then(({notaryContract, notarizedDocumentNftContract, notaryNft, documentPermissionNft}) => {
            console.log(`Notary contract deployed to ${notaryContract.address}`)
            console.log(`NotarizedDocumentNft contract deployed to ${notarizedDocumentNftContract.address}`)
            console.log(`notaryNft contract deployed to ${notaryNft.address}`)
            console.log(`documentPermissionNft contract deployed to ${documentPermissionNft.address}`)
            process.exit(0)
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = deployContacts;