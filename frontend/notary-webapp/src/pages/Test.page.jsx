import {useState} from "react";
import {Button, InputText} from "primereact";
import {
    addDocumentPermissionNftToMetamask,
    addNotarizedDocumentNftToMetamask,
    addNotaryNftToMetamask,
    createNotarizedDocument,
    isDocumentTokenMinted,
    hasNotaryToken,
    mintNotarizedDocumentNft,
    shareNotarizedDocument
} from "../contracts";
import {Card} from "primereact/card";

export default () => {
    const [formData, setFormData] = useState({})

    function boolToString(value) {
        return typeof value === "boolean" ? (value ? 'true' : 'false') : '???';
    }

    return (
        <div className="flex flex-wrap">
            <Card title="Add Notary NFT to Metamask" className="col-3 m-1">
                <Button onClick={addNotaryNftToMetamask}>GO</Button>
            </Card>
            <Card title="Add Notarized Document NFT to metamask" className="col-3 m-1">
                <Button onClick={addNotarizedDocumentNftToMetamask}>GO</Button>
            </Card>
            <Card title="Add Document Permission NFT to metamask" className="col-3 m-1">
                <Button onClick={addDocumentPermissionNftToMetamask}>GO</Button>
            </Card>
            <Card title="Add a Notarized Document" className="col-3 m-1">
                <p><em>Must be signed in as a notary</em></p>
                <div className="field mb-3">
                    <label htmlFor="minter">Authorized minter</label>
                    <InputText
                        id="minter"
                        value={formData.authorizedMinter || ''}
                        onChange={(e) => setFormData({...formData, authorizedMinter: e.target.value})}
                        className="w-full"
                    />
                </div>
                <div className="field mb-3">
                    <label htmlFor="price">Price to mint</label>
                    <InputText
                        id="price"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full"
                    />
                </div>
                <div className="field mb-3">
                    <label htmlFor="metadataUri">Metadata URI</label>
                    <InputText
                        id="metadataUri"
                        value={formData.metadataURI || ''}
                        onChange={(e) => setFormData({...formData, metadataURI: e.target.value})}
                        className="w-full"
                    />
                </div>
                <Button onClick={() => createNotarizedDocument(formData)}>GO</Button>
            </Card>
            <Card title="Mint a Notarized Document NFT" className="col-3 m-1">
                <p><em>Must be signed in as {formData.authorizedMinter | 'the authorized minter'}</em></p>
                <div className="field mb-3">
                    <label htmlFor="price">Price to mint</label>
                    <InputText
                        id="price"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full"
                    />
                </div>
                <div className="field mb-3">
                    <label htmlFor="metadataUri">Metadata URI</label>
                    <InputText
                        id="metadataUri"
                        value={formData.metadataURI || ''}
                        onChange={(e) => setFormData({...formData, metadataURI: e.target.value})}
                        className="w-full"
                    />
                </div>
                <Button onClick={() => mintNotarizedDocumentNft(formData)}>GO</Button>
            </Card>
            <Card title="Issue Document Permission Token" className="col-3 m-1">
                <p><em>Must be signed in as owner of {formData.tokenId | 'the token'}</em></p>
                <div className="field mb-3">
                    <label htmlFor="granteeAddress">Grantee address</label>
                    <InputText
                        id="granteeAddress"
                        value={formData.granteeAddress || ''}
                        onChange={(e) => setFormData({...formData, granteeAddress: e.target.value})}
                        className="w-full"
                    />
                </div>
                <div className="field mb-3">
                    <label htmlFor="tokenId">Token Id</label>
                    <InputText
                        id="tokenId"
                        value={formData.tokenId || ''}
                        onChange={(e) => setFormData({...formData, tokenId: e.target.value})}
                        className="w-full"
                    />
                </div>
                <Button onClick={() => shareNotarizedDocument(formData)}>GO</Button>
            </Card>
            <Card title="Has Notary Token" className="col-3 m-1">
                <div className="field mb-3">
                    <label htmlFor="hasNotaryToken">Has Notary Token</label>
                    <InputText
                        disabled={true}
                        id="hasNotaryToken"
                        value={boolToString(formData.hasNotaryToken)}
                        className="w-full"
                    />
                </div>
                <Button onClick={() => hasNotaryToken(formData).then(r => setFormData({...formData, hasNotaryToken: r}))}>
                    GO
                </Button>
            </Card>
            <Card title="Document Token Minted" className="col-3 m-1">
                <div className="field mb-3">
                    <label htmlFor="metadataUri">Metadata URI</label>
                    <InputText
                        id="metadataUri"
                        value={formData.metadataURI || ''}
                        onChange={(e) => setFormData({...formData, metadataURI: e.target.value})}
                        className="w-full"
                    />
                </div>
                <div className="field mb-3">
                    <label htmlFor="documentTokenMinted">Document Token Minted</label>
                    <InputText
                        disabled={true}
                        id="documentTokenMinted"
                        value={boolToString(formData.hasNotaryToken)}
                        className="w-full"
                    />
                </div>
                <Button onClick={() => isDocumentTokenMinted(formData)
                    .then(r => setFormData({...formData, hasNotaryToken: r}))
                }>
                    GO
                </Button>
            </Card>
        </div>
    )
}