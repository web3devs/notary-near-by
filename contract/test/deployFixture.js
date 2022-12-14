const deploy = require("../scripts/deploy");

async function deployFixture() {
    const [owner, notary, alice, bob, mallory] = await ethers.getSigners();
    const deployResults = await deploy(owner)

    console.log(`owner: ${owner.address}`)
    console.log(`notary: ${notary.address}`)
    console.log(`alice: ${alice.address}`)
    console.log(`mallory: ${mallory.address}`)
    console.log(`notary contract: ${deployResults.notaryContract.address}`)
    console.log(`notarized document nft contract: ${deployResults.notarizedDocumentNftContract.address}`)
    console.log(`notary nft contract: ${deployResults.notaryNft.address}`)
    console.log(`document permission nft contract: ${deployResults.documentPermissionNft.address}`)
    return {owner, notary, alice, bob, mallory, ...deployResults}
}

module.exports = deployFixture