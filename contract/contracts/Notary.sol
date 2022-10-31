// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./NotarizedDocumentNft.sol";
import "./NotaryNft.sol";

struct UnmintedTokenData {
    address notary;
    address authorizedMinter;
    uint256 costToMint;
}

contract Notary is AccessControl {
    NotarizedDocumentNft public notarizedDocumentNftContract;
    NotaryNft public notaryNftContract;

    mapping(string => UnmintedTokenData) public unmintedToken;
    address public commissionPayee;
    uint256 public defaultCommissionPercentage;
    mapping(address => uint256) public balance;

    event NotarizedDocumentCreated(address notary, address authorizedMinter, uint256 price, string metadataUrl);
    event NotarizedDocumentNftMinted(address authorizedMinter, uint256 price, string metadataUrl, uint256 tokenId);
    event CommissionPayeeChanged(address commissionPayee);
    event BalanceIncreased(address payee, uint256 amount);
    event BalanceClaimed(address payee, uint256 amountSent);
    event NotaryCredentialsIssued(address notary, string notaryId, string metadataUri, uint256 tokenId);

    error MustHaveNotaryNft();
    error TokenNotMintable(string metadataUri);
    error MinterNotAuthorized(string metadataUri);
    error IncorrectAmountSent(string metadataUri, uint256 amountSent);
    error NoBalanceAvailable(address payee);

    modifier hasBalance() {
        if (balance[msg.sender] == 0) {
            revert NoBalanceAvailable(msg.sender);
        }
        _;
    }

    modifier onlyNotary() {
        if (notaryNftContract.balanceOf(msg.sender) == 0) {
            revert MustHaveNotaryNft();
        }
        _;
    }

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        commissionPayee = msg.sender;
        defaultCommissionPercentage = 30;
    }

    function setNotarizedDocumentNftContact(NotarizedDocumentNft _ndn) external onlyRole(DEFAULT_ADMIN_ROLE) {
        notarizedDocumentNftContract = _ndn;
    }

    function setNotaryNftContract(NotaryNft _notaryNft) external onlyRole(DEFAULT_ADMIN_ROLE) {
        notaryNftContract = _notaryNft;
    }

    function issueNotaryToken(
        address to, string memory notaryId, string memory metadataUri
    ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256 tokenId) {
        tokenId = notaryNftContract.mint(to, notaryId, metadataUri);
        emit NotaryCredentialsIssued(to, notaryId, metadataUri, tokenId);
    }

    function setCommissionPayee(address _payee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // First, move existing commissionPayee balance to the new payee
        balance[_payee] += balance[commissionPayee];
        balance[commissionPayee] = 0;

        commissionPayee = _payee;
        emit CommissionPayeeChanged(commissionPayee);
    }

    function createNotarizedDocument(
        address _authorizedMinter,
        uint256 _mintingPrice,
        string memory _metadataUrl
    ) external onlyNotary {
        unmintedToken[_metadataUrl] = UnmintedTokenData(msg.sender, _authorizedMinter, _mintingPrice);
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
        _splitPayment(msg.value, tokenParameters.notary);

        tokenId = notarizedDocumentNftContract.mint(msg.sender, _metadataUrl);
        delete unmintedToken[_metadataUrl];

        emit NotarizedDocumentNftMinted(msg.sender, msg.value, _metadataUrl, tokenId);
    }

    function payableBalance() public view returns (uint256 _balance) {
        _balance = balance[msg.sender];
    }

    function claim() public hasBalance {
        uint256 amountToSend = balance[msg.sender];
        balance[msg.sender] = 0;
        payable(msg.sender).transfer(amountToSend);
        emit BalanceClaimed(msg.sender, amountToSend);
    }

    function _splitPayment(uint256 amount, address notary) internal {
        uint256 commission = amount * defaultCommissionPercentage / 100;
        uint256 notaryPayment = amount - commission;
        require(commission + notaryPayment == amount); // Math broke. This should catch any uncaught over/under flows

        balance[notary] += notaryPayment;
        emit BalanceIncreased(notary, notaryPayment);

        balance[commissionPayee] += commission;
        emit BalanceIncreased(commissionPayee, commission);
    }
}

