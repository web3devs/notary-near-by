const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const deployFixture = require("./deployFixture");
const hre = require("hardhat");
const {executeAndGetEvent} = require("./helpers");

describe("NotarizedDocumentTokenNFT contract", function () {
    async function contractFixture() {
        const [owner, minter, notary] = await ethers.getSigners()

        const Contract = await hre.ethers.getContractFactory("NotarizedDocumentNft");
        const contractInstance = await Contract
            .connect(owner)
            .deploy();
        await contractInstance.deployed();

        return {owner, minter, notary, contractInstance}
    }

    it("Deployment should set the token name and symbol", async function () {
        const {contractInstance} = await loadFixture(contractFixture)

        const name = await contractInstance.name();
        expect(name).to.equal("NotarizedDocumentNft");

        const symbol = await contractInstance.symbol()
        expect(symbol).to.equal('NDOC')
    });

    it("should be retrievable by URI", async () => {
        const testUri = "ipfs://MyTestUri"
        const {owner, minter, contractInstance} = await loadFixture(contractFixture)

        const ev = await executeAndGetEvent(
            await contractInstance.connect(owner).mint(minter.address, testUri),
        "Transfer"
        )
        expect(await contractInstance.connect(minter).tokenByUri(testUri)).to.equal(ev.tokenId)
    })
});