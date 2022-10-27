const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const deployFixture = require("./deployFixture");

describe("NotarizedDocumentTokenNFT contract", function () {
    it("Deployment should set the token name and symbol", async function () {
        const {notarizedDocumentNftContract} = await loadFixture(deployFixture)

        const name = await notarizedDocumentNftContract.name();
        expect(name).to.equal("NotarizedDocumentNft");

        const symbol = await notarizedDocumentNftContract.symbol()
        expect(symbol).to.equal('NDOC')
    });

    it("should be owned by the Notary contract", async () => {
        const {notarizedDocumentNftContract, notaryContract} = await loadFixture(deployFixture)
        const contractOwner = await notarizedDocumentNftContract.owner()
        expect(contractOwner).to.equal(notaryContract.address)
    })
});