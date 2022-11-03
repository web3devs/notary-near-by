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

async function deployContacts(wallet) {
    console.log(
        "Deploying contracts with the account:",
        wallet.address
    );

    const notaryContract = await deployContract("Notary", wallet);
    const notarizedDocumentNftContract = await deployContract("NotarizedDocumentNft", wallet);
    const notaryNft = await deployContract("NotaryNft", wallet);
    const documentPermissionNft = await deployContract("DocumentPermissionNft", wallet);

    // Initialize the nft contract addresses in the Notary contract
    await notaryContract.setNotarizedDocumentNftContact(notarizedDocumentNftContract.address, {gasLimit: 3000000})
    await notaryContract.setNotaryNftContract(notaryNft.address, {gasLimit: 3000000})
    await notaryContract.setDocumentPermissionNftContract(documentPermissionNft.address, {gasLimit: 3000000})

    // Transfer ownership of the nft contracts to the Notary contract
    await notarizedDocumentNftContract.transferOwnership(notaryContract.address, {gasLimit: 3000000})
    await notaryNft.transferOwnership(notaryContract.address, {gasLimit: 3000000})
    await documentPermissionNft.transferOwnership(notaryContract.address, {gasLimit: 3000000})

    return {notaryContract, notarizedDocumentNftContract, notaryNft, documentPermissionNft}
}

const main = async () => {
    const provider = hre.ethers.provider;
    const deployerWallet = new hre.ethers.Wallet(process.env.AURORA_PRIVATE_KEY, provider);
    return await deployContacts(deployerWallet);
}

if (require.main === module) {
    main()
        .then(({notaryContract, notarizedDocumentNftContract}) => {
            console.log(`Notary contract deployed to ${notaryContract.address}`)
            console.log(`NotarizedDocumentNft contract deployed to ${notarizedDocumentNftContract.address}`)
            process.exit(0)
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = deployContacts;