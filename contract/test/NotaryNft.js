const {expect} = require("chai");
const hre = require("hardhat");
const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");

describe("NotaryNFT contract", function () {
    async function contractFixture() {
        const [owner, notary1, notary2] = await ethers.getSigners()

        const Contract = await hre.ethers.getContractFactory("NotaryNft");
        const contractInstance = await Contract
            .connect(owner)
            .deploy();
        await contractInstance.deployed();

        return {owner, notary1, notary2, contractInstance}
    }

    it("should set the token name and symbol", async function () {
        const {contractInstance} = await loadFixture(contractFixture)
        const name = await contractInstance.name();
        expect(name).to.equal("Notary Verification Nft");

        const symbol = await contractInstance.symbol()
        expect(symbol).to.equal('Verified Notary')
    });

    it("should mint an NFT", async () => {
        const {contractInstance, owner, notary1} = await loadFixture(contractFixture)
        await expect(
            () => contractInstance.connect(owner).mint(notary1.address, 'foo', 'bar')
        ).to.changeTokenBalance(contractInstance, notary1, 1)
    })

    // TODO For the hackathon, anyone can mint, only the Notary contract can mint in MVP
    it("should allow anyone to mint an NFT", async () => {
        const {contractInstance, notary1} = await loadFixture(contractFixture)
        await expect(
            () => contractInstance.connect(notary1).mint(notary1.address, 'foo', 'bar')
        ).to.changeTokenBalance(contractInstance, notary1, 1)
    })

    it.skip("should prevent non-owner account from minting an NFT", async () => {
        const {contractInstance, notary1} = await loadFixture(contractFixture)
        await expect(
            contractInstance.connect(notary1).mint(notary1.address, 'foo', 'bar')
        ).to.be.revertedWith("Ownable: caller is not the owner")
    })

    it('should prevent minting 2 tokens for the same address', async () => {
        const {contractInstance, owner, notary1} = await loadFixture(contractFixture)
        await contractInstance.connect(owner).mint(notary1.address, '1', 'foo')
        await expect(
            contractInstance.connect(owner).mint(notary1.address, '2', 'bar')
        ).to.revertedWithCustomError(contractInstance, "OnlyOneTokenAllowedPerAddress")
            .withArgs(notary1.address)
    })
    it('should prevent minting 2 tokens for the same notary id', async () => {
        const {contractInstance, owner, notary1, notary2} = await loadFixture(contractFixture)
        await contractInstance.connect(owner).mint(notary1.address, 'one', 'foo')
        await expect(
            contractInstance.connect(owner).mint(notary2.address, 'one', 'bar')
        ).to.revertedWithCustomError(contractInstance, "OnlyOneTokenAllowedPerNotaryId")
            .withArgs('one')
    })
    it('should not allow the owner of a token to transfer it')
    it('should allow the contract owner to transfer an existing token')
    it("should remove the token from the notary's wallet when their permissions are revoked")
});