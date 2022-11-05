// SPDX-License-Identifier: MIT

pragma solidity >=0.8.11;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {IAgeVerifier} from "./interfaces/IAgeVerifier.sol";
import {ISBT} from "./interfaces/ISBT.sol";

error OneTicketOnly();
error OnlyOverAge18();

contract AfterpartySBT is ERC721, Ownable {
    using Strings for uint256;

    uint256 public ticketId;

    string public baseTokenURI;

    mapping(address => uint256) public walletToticketId;

    ISBT public sbt;
    IAgeVerifier public ageVerifier;

    constructor(
        address _SBT,
        address _ageVerifier,
        string memory _baseTokenURI
    ) ERC721("AfterpartySBT", "APSBT") {
        sbt = ISBT(_SBT);
        ageVerifier = IAgeVerifier(_ageVerifier);
        baseTokenURI = _baseTokenURI;
    }

    function mintTicket() public returns (uint256) {
        // Validation
        if (walletToticketId[msg.sender] > 0) revert OneTicketOnly();
        (bytes memory proof, uint256[] memory publicInputs, ) = sbt
            .getAgeProofByLimit(msg.sender, "Over18");
        if (!ageVerifier.verifyProof(proof, publicInputs))
            revert OnlyOverAge18();
        // State changes
        ticketId++;
        walletToticketId[msg.sender] = ticketId;
        // Interactions
        _mint(msg.sender, ticketId);
        return ticketId;
    }

    function getTicketId(address user) external view returns (uint256) {
        return walletToticketId[user];
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
        return baseTokenURI;
    }
}
