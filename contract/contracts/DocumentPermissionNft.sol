// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
 * DocumentPermissionNft
 * An NFT that that grants permission to view a notarized document
 */
contract DocumentPermissionNft is ERC721URIStorage, Ownable {
    uint256 private _tokensCount = 0;

    mapping(string => uint256) public tokenByNotaryId;
    mapping(uint256 => bool) public isActive;

    constructor() ERC721("DocumentPermissionNft", "AUTH") {}

    function mint(address to, string memory notaryId, string memory _metadataUri) external onlyOwner returns (uint256 tokenId) {
        tokenId = _tokensCount + 1;
        tokenByNotaryId[notaryId] = tokenId;
        isActive[tokenId] = true;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _metadataUri);
        _tokensCount = tokenId + 1;
    }

    // TODO implement a way of revoking the authorization that this token grants
}