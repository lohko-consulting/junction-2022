// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

interface ISBT {
    function getAgeProofByLimit(address _user, string memory _limit)
        external
        view
        returns (
            bytes memory,
            uint256[] memory,
            uint256
        );
}
