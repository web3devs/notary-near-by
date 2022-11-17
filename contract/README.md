# Aurora Contracts

## Integration Settings
**Last deployed at Oct-27-2022 10:55 PM +UTC** 

| Contract                                                                                               | Mainnet Deployment | Testnet Address                                                                                                                 |
|--------------------------------------------------------------------------------------------------------|--------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Notary [[ABI](./artifacts/contracts/Notary.sol/Notary.json)]                                           |    not deployed    | [0x3fC198a78991F6F7F492EA3cD631eaf59BB16dE3](https://testnet.aurorascan.dev/address/0x3fC198a78991F6F7F492EA3cD631eaf59BB16dE3) |
| NotarizedDocumentNft [[ABI](./artifacts/contracts/NotarizedDocumentNft.sol/NotarizedDocumentNft.json)] |    not deployed    | [0x974570376D0Aa69Bad101B63c1117f6B3cFcDDb2](https://testnet.aurorascan.dev/address/0x974570376D0Aa69Bad101B63c1117f6B3cFcDDb2) |
| NotaryNft [[ABI](./artifacts/contracts/NotaryNft.sol/NotaryNft.json)] |    not deployed    | [0x38417c8dDA51444142526F9bE14560e3bEe00B6a](https://testnet.aurorascan.dev/address/0x38417c8dDA51444142526F9bE14560e3bEe00B6a) |
| DocumentPermissionNft [[ABI](./artifacts/contracts/DocumentPermissionNft.sol/DocumentPermissionNft.json)] |    not deployed    | [0x3BF4B67e1C0d3a05c2d70175701C43e041A19454](https://testnet.aurorascan.dev/address/0x3BF4B67e1C0d3a05c2d70175701C43e041A19454) |

## Notes about dev install
The currently implemented dev blockchain is the hardhat standard chain. In the future, the aurora local chain may be needed if the contracts interact with the NEAR precompiles.

## Notary.sol
The system controller.

## NotarizedDocumentNft.sol
A simple NFT that stores notarized documents

## Useful links
- [Aurora testnet faucet](https://aurora.dev/faucet)