# Aurora Contracts

## Integration Settings
| Contract                                                                                               | Mainnet Deployment | Testnet Address                            |
|--------------------------------------------------------------------------------------------------------|--------------------|--------------------------------------------|
| Notary ([ABI](./artifacts/contracts/Notary.sol/Notary.json))                                           |    not deployed    | 0x969947A98B96f7ec7bFc22ec959985692c476341 |
| NotarizedDocumentNft ([ABI](./artifacts/contracts/NotarizedDocumentNft.sol/NotarizedDocumentNft.json)) |    not deployed    | 0xFAD78427aBF5B06491ad21E14b28D85C7751397f |

## Notes about dev install
The currently implemented dev blockchain is the hardhat standard chain. In the future, the aurora local chain may be needed if the contracts interact with the NEAR precompiles.

## Notary.sol
The system controller.

## NotarizedDocumentNft.sol
A simple NFT that stores notarized documents

## Useful links
- [Aurora testnet faucet](https://aurora.dev/faucet)