# POPD - Proof Of Personal Data

A Binance Smart Chain solution for securely verifying personal data with 3rd party vendors by sharing as little about the user as possible. The point of POPD is to offer verified Binance accounts a way to prove things about their personal data without actually revealing the data itself. By leveraging zk-SNARK technology, through our portal, accounts can generate zk proofs of their personal data and then store the proofs on-chain as Souldbound Token metadata. These proofs can then be used by any BNB Smart Chain project to ensure, for example, youth safety by age verification. All of this is possible without exposing user’s personal data such as age or an address.

## Running the front-end locally:

```
cd front-end
npm install
npm run dev
```

This starts the development server that can be accessed at http://localhost:3000

## Running the smart contracts

**1 - Install Brownie**

```bash
python3 -m pip install --user pipx
python3 -m pipx ensurepath
# restart your terminal
pipx install eth-brownie
```

Or, if that doesn't work, via pip

```bash
pip install eth-brownie
```

**2 - Clone this**

```bash
git clone https://github.com/lohko-consulting/junction-2022.git
cd contracts
```

**3 - Add your PRIVATE_KEY as an environment variable**

**4 - Deploy everything locally**

```bash
brownie run scripts/deploy.py
```

**6 - Deploy to a testnet**


Run:

```

brownie run scripts/deploy.py --network bsc-test

```

Make sure you have some TBNB. One example faucet: https://testnet.binance.org/faucet-smart


## Integrate Binance zkSBT verification to your dApp

**1 - Download contract interfaces**

Go to your own project's contract’s folder and make a new folder for interfaces:

```
cd contracts
mkdir interfaces
```

Go to https://github.com/lohko-consulting/junction-2022/tree/main/contracts/contracts/interfaces and copy these files to the interfaces folder:

**IAgeVerifier.sol**

**IAreaVerifier.sol**

**IAfterPartySBT.sol**

**2 - Import them to your contract**

Import AgeVerifier and BinanceZKSBT interfaces to your contract by adding these lines on top of your smart contract:

```
import {IAgeVerifier} from "./interfaces/IAgeVerifier.sol";
import {IAreaVerifier} from "./interfaces/IAgeVerifier.sol";
import {IPOPD} from "./interfaces/IPOPD.sol";
```

Define both of these interfaces in your contract:

```
IPOPD public popd;
IAgeVerifier public ageVerifier;
IAreaVerifier public areaVerifier;
```

**3 - Define AgeVerifier and BinanceZKSBT addresses**

Network: BNB Smart Chain Testnet

POPD: 0x9E470b04580F14a5b34620945Eb6C9aF31108E80

AfterpartySBT: 0xFb58695ABae3236a7b62156a4b4C490BC2222aBf

AgeVerifier: 0xB7970f468C8a45972663CDebF20e996ACF54948b

AreaVerifier: 0x67340959297e61E5f58dCCa5c22b7A9EB2112f8F

Solidity code:

```
popd = IPOPD(0x9E470b04580F14a5b34620945Eb6C9aF31108E80);
ageVerifier = IAgeVerifier(0xB7970f468C8a45972663CDebF20e996ACF54948b);
areaVerifier = IAreaVerifier(0x67340959297e61E5f58dCCa5c22b7A9EB2112f8F)
```

**4 - Get and verify proofs inside your contract functions**

**Get proofs from BinanceZKSBT contract:**

Inputs:
address \_user - user address
string \_limit - age proof limit the proof is for i.e. “Over18” or “Over15”

Outputs:
bytes proof - zkSnark proof
uint256 publicInputs - zkSnark public inputs used for proof
uint256 deadline - timestamp for proof depreciation

```
function getAgeProofByLimit(address _user, string memory _limit)
        external
        view
        returns (
            bytes memory,
            uint256[] memory,
            uint256
        );

I.e. get proof for age over 18:
(bytes memory proof, uint256[] memory publicInputs, ) = sbt
            .getAgeProofByLimit(msg.sender, "Over18");
```

**Verify proofs with AgeVerifier/AreaVerifier contract::**

Inputs:
bytes proof - zkSnark proof
uint256 publicInputs - zkSnark public inputs used for proof

Outputs:
bool - if proof is true or false

```

function verifyProof(bytes memory proof, uint256[] memory pubSignals)
        external
        view
        returns (bool);

I.e. verify user to be over the age of 18:

if (!ageVerifier.verifyProof(proof, publicInputs))
            revert OnlyOverAge18();
```

**5 - Enjoy safe minting, voting or anything you’d come up with!**
