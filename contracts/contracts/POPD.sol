// SPDX-License-Identifier: MIT

pragma solidity >=0.8.11;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

error OneBadgeOnly();
error NotBadgeOwner();
error NotValidLimit();
error ProofIsOverdue();

contract POPD is ERC721, Ownable {
    using Strings for uint256;

    uint256 public badgeId = 1;

    struct AgeProof {
        bytes proof;
        uint256[] inputs;
        uint256 deadline;
    }

    mapping(uint256 => mapping(string => AgeProof)) badgeIdToLimitToAgeProof;

    mapping(string => bool) public validLimit;

    mapping(uint256 => AgeProof) public badgeIdToAgeProof;

    mapping(address => uint256) public walletToBadgeId;

    constructor() ERC721("ProofOfPersonalData", "POPD") {}

    function mintBadge() public returns (uint256) {
        // Validation
        if (walletToBadgeId[msg.sender] > 0) revert OneBadgeOnly();
        // verify mint capability from binance with i.e. merkle proof
        // State changes
        badgeId++;
        walletToBadgeId[msg.sender] = badgeId;
        // Interactions
        _mint(msg.sender, badgeId);
        return badgeId;
    }

    function storeAgeProof(
        bytes memory _proof,
        uint256[] memory _inputs,
        string memory _limit
    ) public {
        // Validation
        uint256 _badgeId = walletToBadgeId[msg.sender];
        if (_badgeId == 0) revert NotBadgeOwner();
        if (!isValidLimit(_limit)) revert NotValidLimit();
        // State changes
        badgeIdToLimitToAgeProof[_badgeId][_limit].proof = _proof;
        badgeIdToLimitToAgeProof[_badgeId][_limit].inputs = _inputs;
        badgeIdToLimitToAgeProof[_badgeId][_limit].deadline =
            block.timestamp +
            1 weeks;
    }

    function getAgeProofByLimit(address _user, string memory _limit)
        public
        view
        returns (
            bytes memory,
            uint256[] memory,
            uint256
        )
    {
        uint256 _badgeId = walletToBadgeId[_user];
        //if (isOverdue(_badgeId, _limit)) revert ProofIsOverdue();
        if (!isValidLimit(_limit)) revert NotValidLimit();
        return (
            badgeIdToLimitToAgeProof[_badgeId][_limit].proof,
            badgeIdToLimitToAgeProof[_badgeId][_limit].inputs,
            badgeIdToLimitToAgeProof[_badgeId][_limit].deadline
        );
    }

    function addValidLimits(string[] calldata _limits) external onlyOwner {
        for (uint256 i; i < _limits.length; ) {
            validLimit[_limits[i]] = true;
            unchecked {
                ++i;
            }
        }
    }

    function isValidLimit(string memory _limit) internal view returns (bool) {
        return validLimit[_limit];
    }

    function isOverdue(uint256 _badgeId, string memory _limit)
        internal
        view
        returns (bool)
    {
        if (
            block.timestamp >
            badgeIdToLimitToAgeProof[_badgeId][_limit].deadline
        ) {
            return true;
        }
        return false;
    }

    // ======= OVERRIDES ========

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public virtual override {
        revert("This is SBT.");
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) public virtual override {
        revert("This is SBT.");
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public virtual override {
        revert("This is SBT.");
    }

    function approve(address _to, uint256 _tokenId) public virtual override {
        revert("This is SBT.");
    }

    function setApprovalForAll(address _operator, bool _approved)
        public
        virtual
        override
    {
        revert("This is SBT.");
    }

    function getApproved(uint256 _tokenId)
        public
        view
        override
        returns (address)
    {
        return address(0x0);
    }

    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override
        returns (bool)
    {
        return false;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return _baseURI();
    }
}
