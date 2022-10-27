require('dotenv').config();
const hre = require("hardhat");

async function deployNotarizedDocumentNft(deployerWallet) {
    const Nft = await hre.ethers.getContractFactory("NotarizedDocumentNft");
    const nft = await Nft
        .connect(deployerWallet)
        .deploy();
    await nft.deployed();
    return nft
}

async function deployNotary(deployerWallet) {
    const Notary = await hre.ethers.getContractFactory("Notary");
    const notary = await Notary
        .connect(deployerWallet)
        .deploy();
    await notary.deployed();
    return notary
}

async function deployContacts(wallet) {
    console.log(
        "Deploying contracts with the account:",
        wallet.address
    );

    const notaryContract = await deployNotary(wallet);
    const notarizedDocumentNftContract = await deployNotarizedDocumentNft(wallet);

    // Set the NotarizedDocumentNft contract address in the Notary contract
    await notaryContract.setNotarizedDocumentNftContact(notarizedDocumentNftContract.address, {gasLimit: 3000000})

    // Transfer ownership of the NotarizedDocumentNft contract to the Notary contract
    await notarizedDocumentNftContract.transferOwnership(notaryContract.address, {gasLimit: 3000000})

    return {notaryContract, notarizedDocumentNftContract}
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