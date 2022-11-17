const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers")
const deployFixture = require("./deployFixture")
const {expect} = require("chai")

describe('deployment script', () => {
    describe('NotaryNft', () => {
        it("should be owned by the Notary contract", async () => {
            let {notaryNft, notaryContract} = await loadFixture(deployFixture)
            const contractOwner = await notaryNft.owner()
            expect(contractOwner).to.equal(notaryContract.address)
        })
    })
    describe('NotarizedDocumentNft', () => {
        it("should be owned by the Notary contract", async () => {
            const {notarizedDocumentNftContract, notaryContract} = await loadFixture(deployFixture)
            const contractOwner = await notarizedDocumentNftContract.owner()
            expect(contractOwner).to.equal(notaryContract.address)
        })
    })
})
