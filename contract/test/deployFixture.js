const deploy = require("../scripts/deploy");

async function deployFixture() {
    const [owner, notary, alice, mallory] = await ethers.getSigners();
    const deployResults = await deploy(owner)

    console.log(`owner: ${owner.address}`)
    console.log(`notary: ${notary.address}`)
    console.log(`alice: ${alice.address}`)
    console.log(`mallory: ${mallory.address}`)
    console.log(`notary contract: ${deployResults.notaryContract.address}`)
    console.log(`notarized document nft contract: ${deployResults.notarizedDocumentNftContract.address}`)
    return {owner, notary, alice, mallory, ...deployResults}
}

module.exports = deployFixture