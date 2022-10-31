const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const deployFixture = require("./deployFixture");

describe("NotaryNFT contract", function () {
    it("Deployment should set the token name and symbol", async function () {
        const {notaryNft} = await loadFixture(deployFixture)

        const name = await notaryNft.name();
        expect(name).to.equal("NotaryNft");

        const symbol = await notaryNft.symbol()
        expect(symbol).to.equal('NOT')
    });

    it("should be owned by the Notary contract", async () => {
        const {notaryNft, notaryContract} = await loadFixture(deployFixture)
        const contractOwner = await notaryNft.owner()
        expect(contractOwner).to.equal(notaryContract.address)
    })

    it("should remove the token from the notary's wallet when thier permissions are revoked")
});