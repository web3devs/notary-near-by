# Aurora Contracts

## Integration Settings
**Last deployed at Oct-27-2022 10:55 PM +UTC** 
| Contract                                                                                               | Mainnet Deployment | Testnet Address                                                                                                                 |
|--------------------------------------------------------------------------------------------------------|--------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Notary [[ABI](./artifacts/contracts/Notary.sol/Notary.json)]                                           |    not deployed    | [0x3468A7e79bD12E6d128E8207cbE4FB4496848Db7](https://testnet.aurorascan.dev/address/0x3468A7e79bD12E6d128E8207cbE4FB4496848Db7) |
| NotarizedDocumentNft [[ABI](./artifacts/contracts/NotarizedDocumentNft.sol/NotarizedDocumentNft.json)] |    not deployed    | [0x38e38D74Be65B291bD7Df38eF74089916bdA7124](https://testnet.aurorascan.dev/address/0x38e38D74Be65B291bD7Df38eF74089916bdA7124) |

## Notes about dev install
The currently implemented dev blockchain is the hardhat standard chain. In the future, the aurora local chain may be needed if the contracts interact with the NEAR precompiles.

## Notary.sol
The system controller.

## NotarizedDocumentNft.sol
A simple NFT that stores notarized documents

## Useful links
- [Aurora testnet faucet](https://aurora.dev/faucet)