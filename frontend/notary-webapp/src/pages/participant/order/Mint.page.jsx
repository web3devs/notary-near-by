import { Button, Card, ProgressSpinner } from 'primereact'
import { useEffect, useState } from 'react'
import MintImage from '../../../assets/mint-image.png'
import { ipfsURL } from '../../../utils/ipfs'
import { mintNotarizedDocumentNft } from '../../../contracts/index'
import { useParams } from 'react-router-dom'
import { getOrder } from '../../../api';

export default () => {
  const [isLoading, setIsLoading] = useState(false)
  const [order, setOrder] = useState(undefined);
  const [tokenMinted, setTokenMinted] = useState(false)
  const pms = useParams();

  useEffect(() => {
    ; (async () => {
      if (pms) {
        const { order, download_url } = await getOrder(pms.id);
        setOrder({ ...order });
      }
    })()
  }, [pms]);

  const mint = async (o) => {
    try {
      setIsLoading(() => setIsLoading(true))
      const tokenID = await mintNotarizedDocumentNft({
        metadataURI: ipfsURL(o.cid),
        price: 30, //?????
      })
    } catch (e) {
      setTokenMinted(true) //XXX: REMOVE THIS
    }
    finally {
      setIsLoading(() => setIsLoading(false))
    }

    console.log('tokenID: ', tokenID)
  }

  const download = async (o) => {
    try {
      setIsLoading(() => setIsLoading(true))
      
    } catch (e) {
      setTokenMinted(true) //XXX: REMOVE THIS
    }
    finally {
      setIsLoading(() => setIsLoading(false))
    }

    console.log('tokenID: ', tokenID)
  }

  return (
    <div className="flex flex-column align-items justify-content-center">
      <div className="flex justify-content-between">
        <h1 className="flex align-items-center justify-content-center">{tokenMinted ? 'Download Document' : 'Claim Document'}</h1>
      </div>
      <Card className="bg-white">
        <div className="flex flex-column align-items align-items-center justify-content-center mt-8 mb-8">
          {!order && (
            <div className="flex flex-column align-items align-items-center justify-content-center mt-8 mb-8">
              <ProgressSpinner />
            </div>
          )}
          
          {order && (
            <>
              <div>
                <img src={MintImage} alt="Mint image" style={{
                  // width: 210,
                  height: 159
                }} />
              </div>
              <div className="text-color font-bold mt-3">
                Claim the document by <strong>minting Document Ownership NFT</strong>
              </div>
              <div className="text-500 mt-3">
                If you have the NFT in your wallet, you'll always be able to download the documents here.
              </div>
              <div className="mt-3">
                {!tokenMinted && <Button disabled={isLoading} label="Mint" onClick={() => mint(order)} icon={isLoading ? 'pi pi-spinner' : 'pi pi-bitcoin'} iconPos="right" />}
                {tokenMinted && <Button disabled={isLoading} label="Download" onClick={() => mint(order)} icon={isLoading ? 'pi pi-spinner' : 'pi pi-download'} iconPos="right" />}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
