// SPDX-License-Identifier: MIT
// Creator: lohko.io

pragma solidity >=0.8.11;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {IAgeVerifier} from "./interfaces/IAgeVerifier.sol";
import {IPOPD} from "./interfaces/IPOPD.sol";

contract AfterpartySBT is ERC721, Ownable {
    using Strings for uint256;

    /*//////////////////////////////////////////////////////////////
                           VARIABLES/MAPPINGS
    //////////////////////////////////////////////////////////////*/

    uint256 public ticketId;

    string public baseTokenURI;

    mapping(address => uint256) public walletToticketId;

    IPOPD public popd;
    IAgeVerifier public ageVerifier;

    /*//////////////////////////////////////////////////////////////
                           ERRORS
    //////////////////////////////////////////////////////////////*/

    error OneTicketOnly();
    error OnlyOverAge18();

    /*//////////////////////////////////////////////////////////////
                           CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        address _POPD,
        address _ageVerifier,
        string memory _baseTokenURI
    ) ERC721("AfterpartySBT", "APSBT") {
        popd = IPOPD(_POPD);
        ageVerifier = IAgeVerifier(_ageVerifier);
        baseTokenURI = _baseTokenURI;
    }

    /*//////////////////////////////////////////////////////////////
                           MINTING LOGIC
    //////////////////////////////////////////////////////////////*/

    function mintTicket() public returns (uint256) {
        // Validation
        if (walletToticketId[msg.sender] > 0) revert OneTicketOnly();
        (bytes memory proof, uint256[] memory publicInputs, ) = popd
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

    /*//////////////////////////////////////////////////////////////
                           GETTERS
    //////////////////////////////////////////////////////////////*/

    function getTicketId(address user) external view returns (uint256) {
        return walletToticketId[user];
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
        return baseTokenURI;
    }
}
