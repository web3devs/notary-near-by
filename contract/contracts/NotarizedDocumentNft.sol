// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NotarizedDocumentNft is ERC721URIStorage, Ownable {
    uint256 private _tokensCount = 0;
    mapping(string => uint256) public tokenByUri;

    constructor() ERC721("NotarizedDocumentNft", "NDOC") {}

    function mint(address to, string memory _metadataUri) external onlyOwner returns (uint256 tokenId) {
        tokenId = _tokensCount + 1;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _metadataUri);
        tokenByUri[_metadataUri] = tokenId;
        _tokensCount = tokenId;
    }
}