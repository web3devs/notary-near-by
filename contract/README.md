# Aurora Contracts

## Integration Settings
**Last deployed at Oct-27-2022 10:55 PM +UTC** 

| Contract                                                                                               | Mainnet Deployment | Testnet Address                                                                                                                 |
|--------------------------------------------------------------------------------------------------------|--------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Notary [[ABI](./artifacts/contracts/Notary.sol/Notary.json)]                                           |    not deployed    | [0xa11Cc4643710013A2E937925B63856A21D543e4a](https://testnet.aurorascan.dev/address/0xa11Cc4643710013A2E937925B63856A21D543e4a) |
| NotarizedDocumentNft [[ABI](./artifacts/contracts/NotarizedDocumentNft.sol/NotarizedDocumentNft.json)] |    not deployed    | [0x091f44543176809A82cB3AB5A587F41C9d0CaDd4](https://testnet.aurorascan.dev/address/0x091f44543176809A82cB3AB5A587F41C9d0CaDd4) |
| NotaryNft [[ABI](./artifacts/contracts/NotaryNft.sol/NotaryNft.json)] |    not deployed    | [0xA0A20C243a22995ce9a47225F5674c651B02bf32](https://testnet.aurorascan.dev/address/0xA0A20C243a22995ce9a47225F5674c651B02bf32) |
| DocumentPermissionNft [[ABI](./artifacts/contracts/DocumentPermissionNft.sol/DocumentPermissionNft.json)] |    not deployed    | [0x1738422D77298082F2d8d8E8C73AaAE5a9d3990b](https://testnet.aurorascan.dev/address/0x1738422D77298082F2d8d8E8C73AaAE5a9d3990b) |

## Notes about dev install
The currently implemented dev blockchain is the hardhat standard chain. In the future, the aurora local chain may be needed if the contracts interact with the NEAR precompiles.

## Notary.sol
The system controller.

## NotarizedDocumentNft.sol
A simple NFT that stores notarized documents

## Useful links
- [Aurora testnet faucet](https://aurora.dev/faucet)