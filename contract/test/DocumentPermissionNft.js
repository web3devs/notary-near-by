const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const deployFixture = require("./deployFixture");

describe("DocumentPermissionNft contract", function () {
    it("Deployment should set the token name and symbol", async function () {
        const {documentPermissionNft} = await loadFixture(deployFixture)

        const name = await documentPermissionNft.name();
        expect(name).to.equal("DocumentPermissionNft");

        const symbol = await documentPermissionNft.symbol()
        expect(symbol).to.equal('AUTH')
    });

    it("should be owned by the Notary contract", async () => {
        const {documentPermissionNft, notaryContract} = await loadFixture(deployFixture)
        const contractOwner = await documentPermissionNft.owner()
        expect(contractOwner).to.equal(notaryContract.address)
    })
});