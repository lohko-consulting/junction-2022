// SPDX-License-Identifier: MIT
// Creator: lohko.io

pragma solidity >=0.8.11;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract POPD is ERC721, Ownable {
    using Strings for uint256;

    /*//////////////////////////////////////////////////////////////
                            PARAMETERS
    //////////////////////////////////////////////////////////////*/

    uint256 public badgeId = 1;

    uint256 public EXPIRATION_TIME = 4 weeks;

    /*//////////////////////////////////////////////////////////////
                           STRUCTS
    //////////////////////////////////////////////////////////////*/

    struct AgeProof {
        bytes proof;
        uint256[] inputs;
    }

    struct AreaProof {
        bytes proof;
        uint256[] inputs;
        uint256 expiration;
    }

    /*//////////////////////////////////////////////////////////////
                           AGE MAPPINGS
    //////////////////////////////////////////////////////////////*/

    mapping(uint256 => mapping(string => AgeProof)) badgeIdToLimitToAgeProof;

    mapping(uint256 => AgeProof) public badgeIdToAgeProof;

    mapping(string => bool) public validAgeLimit;

    /*//////////////////////////////////////////////////////////////
                           AREA MAPPINGS
    //////////////////////////////////////////////////////////////*/

    mapping(uint256 => mapping(string => AreaProof)) badgeIdToLimitToAreaProof;

    mapping(uint256 => AgeProof) public badgeIdToAreaProof;

    mapping(string => bool) public validAreaLimit;

    mapping(address => uint256) public walletToBadgeId;

    /*//////////////////////////////////////////////////////////////
                           ERRORS
    //////////////////////////////////////////////////////////////*/

    error OneBadgeOnly();
    error NotBadgeOwner();
    error NotValidAgeLimit();
    error NotValidAreaLimit();
    error ProofIsExpired();

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() ERC721("ProofOfPersonalData", "POPD") {}

    /*//////////////////////////////////////////////////////////////
                          MINTING LOGIC
    //////////////////////////////////////////////////////////////*/

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

    /*//////////////////////////////////////////////////////////////
                          AGE PROOF LOGIC
    //////////////////////////////////////////////////////////////*/

    function storeAgeProof(
        bytes memory _proof,
        uint256[] memory _inputs,
        string memory _limit
    ) public {
        // Validation
        uint256 _badgeId = walletToBadgeId[msg.sender];
        if (_badgeId == 0) revert NotBadgeOwner();
        if (!isValidAgeLimit(_limit)) revert NotValidAgeLimit();
        // State changes
        badgeIdToLimitToAgeProof[_badgeId][_limit].proof = _proof;
        badgeIdToLimitToAgeProof[_badgeId][_limit].inputs = _inputs;
    }

    function getAgeProofByLimit(address _user, string memory _limit)
        public
        view
        returns (bytes memory, uint256[] memory)
    {
        uint256 _badgeId = walletToBadgeId[_user];
        if (!isValidAgeLimit(_limit)) revert NotValidAgeLimit();
        return (
            badgeIdToLimitToAgeProof[_badgeId][_limit].proof,
            badgeIdToLimitToAgeProof[_badgeId][_limit].inputs
        );
    }

    function addValidAgeLimits(string[] calldata _limits) external onlyOwner {
        for (uint256 i; i < _limits.length; ) {
            validAgeLimit[_limits[i]] = true;
            unchecked {
                ++i;
            }
        }
    }

    function isValidAgeLimit(string memory _limit)
        internal
        view
        returns (bool)
    {
        return validAgeLimit[_limit];
    }

    /*//////////////////////////////////////////////////////////////
                          AREA PROOF LOGIC
    //////////////////////////////////////////////////////////////*/

    function storeAreaProof(
        bytes memory _proof,
        uint256[] memory _inputs,
        string memory _limit
    ) public {
        // Validation
        uint256 _badgeId = walletToBadgeId[msg.sender];
        if (_badgeId == 0) revert NotBadgeOwner();
        if (!isValidAreaLimit(_limit)) revert NotValidAreaLimit();
        // State changes
        badgeIdToLimitToAreaProof[_badgeId][_limit].proof = _proof;
        badgeIdToLimitToAreaProof[_badgeId][_limit].inputs = _inputs;
        badgeIdToLimitToAreaProof[_badgeId][_limit].expiration =
            block.timestamp +
            EXPIRATION_TIME;
    }

    function getAreaProofByLimit(address _user, string memory _limit)
        public
        view
        returns (bytes memory, uint256[] memory)
    {
        uint256 _badgeId = walletToBadgeId[_user];
        if (!isValidAreaLimit(_limit)) revert NotValidAreaLimit();
        if (isExpired(_badgeId, _limit)) revert ProofIsExpired();
        return (
            badgeIdToLimitToAreaProof[_badgeId][_limit].proof,
            badgeIdToLimitToAreaProof[_badgeId][_limit].inputs
        );
    }

    function addValidAreaLimits(string[] calldata _limits) external onlyOwner {
        for (uint256 i; i < _limits.length; ) {
            validAreaLimit[_limits[i]] = true;
            unchecked {
                ++i;
            }
        }
    }

    function isValidAreaLimit(string memory _limit)
        internal
        view
        returns (bool)
    {
        return validAreaLimit[_limit];
    }

    function isExpired(uint256 _badgeId, string memory _limit)
        internal
        view
        returns (bool)
    {
        if (
            block.timestamp >
            badgeIdToLimitToAreaProof[_badgeId][_limit].expiration
        ) {
            return true;
        }
        return false;
    }

    /*//////////////////////////////////////////////////////////////
                          OVERRIDES (LAZY WAY TO SBT)
    //////////////////////////////////////////////////////////////*/

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
