const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const deployFixture = require("./deployFixture");

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
describe("Notary contract", function () {
    it("notarizedDocumentNft should be set", async function () {
        const {notarizedDocumentNftContract, notaryContract} = await loadFixture(deployFixture)

        const ndn = await notaryContract.ndn();
        expect(ndn).to.equal(notarizedDocumentNftContract.address);
    });

    it("admin should be able to add a notary", async () => {
        const {notaryContract, notary} = await loadFixture(deployFixture)
        const role = await notaryContract.NOTARY_ROLE()

        expect(
            await notaryContract.hasRole(role, notary.address)
        ).to.be.false

        await notaryContract.grantRole(role, notary.address)

        expect(
            await notaryContract.hasRole(role, notary.address)
        ).to.be.true
    })

    it("should not allow a sender who isn't a notary to create a notarized document", async () => {
        const {notaryContract, alice, mallory} = await loadFixture(deployFixture)
        await expect(
            notaryContract.connect(mallory).createNotarizedDocument(alice.address, 99, 'ipfs://bogusUri')
        ).to.be.reverted
    })

    it("should emit NotarizedDocumentCreated when a notarized document is created", async () => {
        const {notaryContract, alice, notary} = await loadFixture(deployFixture)
        const role = await notaryContract.NOTARY_ROLE()
        await notaryContract.grantRole(role, notary.address)

        await expect(
            notaryContract.connect(notary).createNotarizedDocument(alice.address, 999, 'ipfs://bogusUri')
        )
            .to.emit(notaryContract, "NotarizedDocumentCreated")
            .withArgs(notary.address, alice.address, 999, 'ipfs://bogusUri')
    })

    describe("minting", () => {
        const ipfsBogusUri = 'ipfs://bogusUri';
        let notaryContract, alice, notary, mallory, notarizedDocumentNftContract, role

        beforeEach(async () => {
            (
                {notaryContract, alice, notary, mallory, notarizedDocumentNftContract} = await loadFixture(deployFixture)
            )
            role = await notaryContract.NOTARY_ROLE()
            await notaryContract.grantRole(role, notary.address)
            await notaryContract.connect(notary).createNotarizedDocument(alice.address, 99, ipfsBogusUri)
        })
        it("should emit a Transfer event when NotarizedDocumentNft is minted", async () => {
            await expect(notaryContract.connect(alice).mint(ipfsBogusUri, {value: 99}))
                .to.emit(notarizedDocumentNftContract, 'Transfer')
                .withArgs(NULL_ADDRESS, alice.address, anyValue)
        })
        it("should emit a NotarizedDocumentNftMinted event when NotarizedDocumentNft is minted", async () => {
            await expect(notaryContract.connect(alice).mint(ipfsBogusUri, {value: 99}))
                .to.emit(notaryContract, 'NotarizedDocumentNftMinted')
                .withArgs(alice.address, 99, ipfsBogusUri, anyValue)
        })
        it("should transfer a token to alice", async () => {
            await expect(() => notaryContract.connect(alice).mint(ipfsBogusUri, {value: 99}))
                .to.changeTokenBalance(notarizedDocumentNftContract, alice, 1)
        })
        it("should deny minting by an unauthorized account", async () => {
            await expect(notaryContract.connect(mallory).mint(ipfsBogusUri, {value: 99}))
                .to.be.revertedWithCustomError(notaryContract, "MinterNotAuthorized")
        })
        it("should not allow a token to be minted twice", async () => {
            await notaryContract.connect(alice).mint(ipfsBogusUri, {value: 99})
            await expect(notaryContract.connect(alice).mint(ipfsBogusUri, {value: 99}))
                .to.be.revertedWithCustomError(notaryContract, "TokenNotMintable")
        })
        it.skip("should set the metadata irl on the minted token", async () => {
            const tokenId = await notaryContract.connect(alice).mint(ipfsBogusUri, {value: 99}) // FIXME A transaction is returned
            expect(await notarizedDocumentNftContract.tokenURI(tokenId)).to.equal(ipfsBogusUri)
        })
        it("should fail when when the incorrect amount of eth is sent", async () => {
            await expect(notaryContract.connect(alice).mint(ipfsBogusUri, {value: 88}))
                .to.be.revertedWithCustomError(notaryContract, "IncorrectAmountSent")
        })
    })
});