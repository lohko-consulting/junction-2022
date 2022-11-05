// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IAgeVerifier {
    function verifyProof(bytes memory proof, uint256[] memory pubSignals)
        external
        view
        returns (bool);
}
