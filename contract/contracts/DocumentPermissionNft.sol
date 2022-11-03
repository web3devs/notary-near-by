// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
 * DocumentPermissionNft
 * An NFT that that grants permission to view a notarized document
 */
contract DocumentPermissionNft is ERC721Enumerable, Ownable {
    mapping(uint256 => uint256) public notarizedDocument;

    constructor() ERC721("DocumentPermissionNft", "AUTH") {}

    function mint(address to, uint256 documentTokenId) external onlyOwner returns (uint256 tokenId) {
        tokenId = getTokenId(to, documentTokenId);
        notarizedDocument[tokenId] = documentTokenId;
        _safeMint(to, tokenId);
    }

    function burn(address to, uint256 documentTokenId) external onlyOwner {
        uint256 tokenId = getTokenId(to, documentTokenId);
        super._burn(tokenId);
    }

    function getTokenId(address to, uint256 documentTokenId) public pure returns (uint256 tokenId) {
        tokenId = uint256(keccak256(abi.encodePacked(to, documentTokenId)));
    }

    // TODO revoke all grants when the NotarizedDocumentNft is revoked
}