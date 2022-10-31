const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const deployFixture = require("./deployFixture");

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
describe("Notary contract", function () {
    it("should have notarizedDocumentNft set after it is deployed", async function () {
        const {notarizedDocumentNftContract, notaryContract} = await loadFixture(deployFixture)

        const ndn = await notaryContract.notarizedDocumentNftContract();
        expect(ndn).to.equal(notarizedDocumentNftContract.address);
    });
    it("should have notaryNft set after it is deployed", async function() {
        const {notaryNft, notaryContract} = await loadFixture(deployFixture)

        const notaryNftAddress = await notaryContract.notaryNftContract();
        expect(notaryNftAddress).to.equal(notaryNft.address);
    })
    it("admin should be able to issue a notary token", async () => {
        const {notaryContract, notaryNft, owner, notary} = await loadFixture(deployFixture)
        await expect(
            () => notaryContract.connect(owner).issueNotaryToken(notary.address, "123ABC", "ftp://beepboop")
        ).to.changeTokenBalance(notaryNft, notary,1)
    })
    it("should prevent a non-admin issuing a notary token", async () => {
        const {notaryContract, mallory, notary} = await loadFixture(deployFixture)
        await expect(
            notaryContract.connect(mallory).issueNotaryToken(notary.address, "123ABC", "ftp://beepboop")
        ).to.be.reverted
    })
    it("should emit NotaryCredentialsIssued when a notary token is issued", async () => {
        const {notaryContract, owner, notary} = await loadFixture(deployFixture)
        const mockNotaryId = "123ABC";
        const mockMetadataUri = "ftp://beepboop";
        await expect(
            notaryContract.connect(owner).issueNotaryToken(notary.address, mockNotaryId, mockMetadataUri)
        ).to.emit(notaryContract, "NotaryCredentialsIssued")
            .withArgs(notary.address, mockNotaryId, mockMetadataUri, anyValue)
    })
    it("should not allow a sender who isn't a notary to create a notarized document", async () => {
        const {notaryContract, alice, mallory} = await loadFixture(deployFixture)
        await expect(
            notaryContract.connect(mallory).createNotarizedDocument(alice.address, 99, 'ipfs://bogusUri')
        ).to.be.reverted
    })
    it("should emit NotarizedDocumentCreated when a notarized document is created", async () => {
        const {notaryContract, alice, notary, owner} = await loadFixture(deployFixture)
        await notaryContract.connect(owner).issueNotaryToken(notary.address, "123ABC", "ftp://beepboop")
        await expect(
            notaryContract.connect(notary).createNotarizedDocument(alice.address, 999, 'ipfs://bogusUri')
        )
            .to.emit(notaryContract, "NotarizedDocumentCreated")
            .withArgs(notary.address, alice.address, 999, 'ipfs://bogusUri')
    })
    describe("minting", () => {
        const ipfsBogusUri = 'ipfs://bogusUri';
        let notarizedDocumentNftContract, notaryContract, alice, notary, mallory, owner

        beforeEach(async () => {
            (
                {notarizedDocumentNftContract, notaryContract, alice, notary, mallory, owner} = await loadFixture(deployFixture)
            )
            notaryContract.connect(owner).issueNotaryToken(notary.address, "123ABC", "ftp://beepboop")
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
    })
    describe("payment", async () => {
        const ipfsBogusUri = 'ipfs://bogusUri';
        let notaryContract, alice, notary, mallory, notarizedDocumentNftContract

        beforeEach(async () => {
            (
                {notaryContract, owner, alice, notary, mallory, notarizedDocumentNftContract} = await loadFixture(deployFixture)
            )
            await notaryContract.connect(owner).issueNotaryToken(notary.address, "123ABC", "ftp://beepboop")
            await notaryContract.connect(notary).createNotarizedDocument(alice.address, 100, ipfsBogusUri)
        })
        it("should set the commission payee to the contract owner", async () => {
            await expect(await notaryContract.commissionPayee()).to.equal(owner.address);
        })
        it("should fail when when the incorrect amount of eth is sent", async () => {
            await expect(notaryContract.connect(alice).mint(ipfsBogusUri, {value: 88}))
                .to.be.revertedWithCustomError(notaryContract, "IncorrectAmountSent")
        })
        it("should allocate 30% of the NFT payment to the commission payee", async () => {
            await expect(notaryContract.connect(alice).mint(ipfsBogusUri, {value: 100}))
                .to.emit(notaryContract, "BalanceIncreased")
                .withArgs(owner.address, 30)
            await expect(await notaryContract.connect(owner).payableBalance()).to.equal(30)
        })
        it("should allocate 70% of the NFT payment to the notary", async () => {
            await expect(notaryContract.connect(alice).mint(ipfsBogusUri, {value: 100}))
                .to.emit(notaryContract, "BalanceIncreased")
                .withArgs(notary.address, 70)
            await expect(await notaryContract.connect(notary).payableBalance()).to.equal(70)
        })
        it("should send allocated funds when requested", async () => {
            await notaryContract.connect(alice).mint(ipfsBogusUri, {value: 100})
            await expect(await notaryContract.connect(owner).claim())
                .to.changeEtherBalances([notaryContract.address, owner.address], [-30, 30])
        })
        it("should zero balance after funds are claimed", async () => {
            await notaryContract.connect(alice).mint(ipfsBogusUri, {value: 100})
            await notaryContract.connect(notary).claim()
            await expect(await notaryContract.connect(notary).payableBalance()).to.equal(0)
        })
        it("should revert when there is not a balance to be claimed", async () => {
            await expect(notaryContract.connect(mallory).claim())
                .to.be.revertedWithCustomError(notaryContract, "NoBalanceAvailable")
                .withArgs(mallory.address)
        })
        it("should transfer commission payee's balance to new commission payee when the payee is changed", async () => {
            await notaryContract.connect(alice).mint(ipfsBogusUri, {value: 100})
            const beforeBalanceOld = await notaryContract.connect(owner).payableBalance()
            const beforeBalanceNew = await notaryContract.connect(notary).payableBalance()

            await notaryContract.connect(owner).setCommissionPayee(notary.address)

            expect(await notaryContract.connect(owner).payableBalance())
                .to.equal(0)
            expect(await notaryContract.connect(notary).payableBalance())
                .to.equal(beforeBalanceOld.add(beforeBalanceNew))
        })
        it("should report when the commission payee is changed", async () => {
            await expect(await notaryContract.connect(owner).setCommissionPayee(notary.address))
                .to.emit(notaryContract, "CommissionPayeeChanged")
                .withArgs(notary.address)
        })
        it("should revert when commission payee change is unauthorized", async () => {
            await expect(notaryContract.connect(mallory).setCommissionPayee(notary.address))
                .to.be.reverted
        })
    })
});