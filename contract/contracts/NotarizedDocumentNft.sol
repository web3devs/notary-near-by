// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract NotarizedDocumentNft is ERC721URIStorage, Ownable {
    uint256 private _tokensCount = 0;

    constructor() ERC721("NotarizedDocumentNft", "NDOC") {}

    function mint(address to, string memory _metadataUri) external onlyOwner returns (uint256 tokenId) {
        tokenId = _tokensCount;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _metadataUri);
        _tokensCount = tokenId + 1;
//        console.log(tokenId, _tokensCount);
//        tokenId = 9999;
    }
}