// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./NotarizedDocumentNft.sol";

struct UnmintedTokenData {
    address authorizedMinter;
    uint256 costToMint;
}

contract Notary is AccessControl {
    NotarizedDocumentNft public ndn;

    bytes32 public constant NOTARY_ROLE = keccak256("NOTARY_ROLE");
    mapping(string => UnmintedTokenData) public unmintedToken;

    event NotarizedDocumentCreated(address notary, address authorizedMinter, uint256 price, string metadataUrl);
    event NotarizedDocumentNftMinted(address authorizedMinter, uint256 price, string metadataUrl, uint256 tokenId);

    error TokenNotMintable(string metadataUri);
    error MinterNotAuthorized(string metadataUri);
    error IncorrectAmountSent(string metadataUri, uint256 amountSent);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setNotarizedDocumentNftContact(NotarizedDocumentNft _ndn) external onlyRole(DEFAULT_ADMIN_ROLE) {
        ndn = _ndn;
    }

    function createNotarizedDocument(
        address _authorizedMinter,
        uint256 _mintingPrice,
        string memory _metadataUrl
    ) external onlyRole(NOTARY_ROLE) {
        unmintedToken[_metadataUrl] = UnmintedTokenData(_authorizedMinter, _mintingPrice);
        emit NotarizedDocumentCreated(msg.sender, _authorizedMinter, _mintingPrice, _metadataUrl);
    }

    function mint(string memory _metadataUrl) payable external returns (uint256 tokenId) {
        UnmintedTokenData memory tokenParameters = unmintedToken[_metadataUrl];
        if (tokenParameters.authorizedMinter == address(0)) {
            revert TokenNotMintable(_metadataUrl);
        }
        if (tokenParameters.authorizedMinter != msg.sender) {
            revert MinterNotAuthorized(_metadataUrl);
        }
        if (tokenParameters.costToMint != msg.value) {
            revert IncorrectAmountSent(_metadataUrl, msg.value);
        }
        tokenId = ndn.mint(msg.sender, _metadataUrl);
        delete unmintedToken[_metadataUrl];

        emit NotarizedDocumentNftMinted(msg.sender, msg.value, _metadataUrl, tokenId);
    }
}

