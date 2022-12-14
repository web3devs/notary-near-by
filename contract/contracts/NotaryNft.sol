// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
 * NotaryNft
 * An NFT that holds the credentials of a notary. Wallets that holds this NFT can add notarized documents
 * to the Notary contract.
 */
contract NotaryNft is ERC721URIStorage, Ownable {
    uint256 private _tokensCount = 0;

    mapping(string => uint256) public tokenByNotaryId;
    mapping(uint256 => bool) public isActive;

    error OnlyOneTokenAllowedPerAddress(address to);
    error OnlyOneTokenAllowedPerNotaryId(string notaryId);

    modifier onlyOnePerAddress(address to) {
        if (balanceOf(to) != 0) {
            revert  OnlyOneTokenAllowedPerAddress(to);
        }
        _;
    }

    modifier onlyOnePerId(string memory notaryId) {
        if (tokenByNotaryId[notaryId] != 0) {
            revert OnlyOneTokenAllowedPerNotaryId(notaryId);
        }
        _;
    }

    constructor() ERC721("Verified Notary Credentials", "Notary Cert") {}

    // TODO For the hackathon, anyone can mint, add onlyOwner modifier before MVP
    function mint(
        address to, string memory notaryId, string memory _metadataUri
    ) external /*onlyOwner*/ onlyOnePerAddress(to) onlyOnePerId(notaryId) returns (uint256 tokenId) {
        tokenId = _tokensCount + 1;
        tokenByNotaryId[notaryId] = tokenId;
        isActive[tokenId] = true;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _metadataUri);
        _tokensCount = tokenId + 1;
    }

    // TODO implement a way of revoking the authorization that this token grants
}