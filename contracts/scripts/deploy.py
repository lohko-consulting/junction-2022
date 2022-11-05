from brownie import POPD, Verifier, AgeVerifier, AfterpartySBT, AreaVerifier
from scripts.helper_functions import get_account

afterpartyUri = "ipfs://afterpartyuri"
proof = 0x1ccecbf1b0a29eae06c869c5de733e49c9cb77e6537c07d726499b0095e909770edae5399beb84f845ffa9b2fd3b38f5e4e674889facf7a597417a0f4cabc8a61076deab20e3d9548dce4e85081104767bcb290506cbad728476e57a744924431cbfdc5634b20f9ad5779981b00699bded8b9daef8e8ecb6eab2e27ee3655f01017bf3326ef9efad8c4fac2d0faa0256a38a83b7f421e568f3bf9cc4425555352f4c1cdc2d7a9aec5b9d30c3af2c0bdc10c9a6cfc18bd1fe50c25ee9d69cc5ca052fa150417f21bb489ad4c99c13353db7f581f8aa988c7e0bc4a97e09c306a12bf8f7f6110ab15dbf67cccd98cdbc9c45e74bf6fea390d9238d75c3c3df5c3a2f3e7bb69c74a7af83aae6363091d1599865fcc3fee11c8102f7baa5199ce7760005d84cb78281e19de5cf85e1fdafbb0882989742b132d55bc92b00b55421f6221acb096c2ba427ad7493b23f228f54a0779d98de9a5b43dafe1c9dcb452c3a0bcd02e8d20159b9cea0fb6553ecc45c2d314774f884a503993ac66762e3a1982700cda18f01cd69c001000695b2e323ce89abec1cf773b0ab67a724fcdd90522982b661074b2c335393e119730146146287778106f96c9aa5503707817e70ff15b39947aec01b76020e400d81c3b8353ec9bd5fd870af3f5357474e7b85eba7098193ab3e558ffbea0bfad2a1f47f3b727658c44e46ec54fe3e6d998cb7566407450894254416edd6fc42d8c930842563c5de7787941b8531a28fab119acd8b151521e315777d06237c7330a21ea67ce3b7fa7b4e61dcba16178ff062442efc23fe0a84c5c713aeb00f27472593cabe44874ee027606691078d466d9f4eb57e1aab81183fdb9953ff91e02c735b9a7552f9c04c973ed97b38c443da0e0c6d5609172524ed59b4a79b98d05cacef25ee572cb598090f413b5c28c1c63716885c0e6e05ab0da5bfa3164ccf7975784b8f8592cd0ec24034f9dc08e1e3caf2dc2f29c36faa8b8a685ba7870b37ed8e88719b646f2c82951916f4a9bb429aacd79310bf3ca35489b30b19590cf1030113fd1a94a50e9c8025d4506fe8ca5592fc5f2c3d707d78b501c00047b40dd0cdeca1244a5df97ddfb37162cd40026e115a5f
public_inputs = ["0x0000000000000000000000000000000000000000000000000000000000000001","0x0000000000000000000000000000000000000000000000000000000000000012"]

def deploy():
    account = get_account()
    publish_source = False
    sbt_badge = POPD.deploy(
        {"from": account},
        publish_source=publish_source,
    )
    print(f"Contract {sbt_badge.address} deployed succesfully!")
    print(
        f"View the contract at https://rinkeby.etherscan.io/address/{sbt_badge.address}"
    )
    tx = sbt_badge.addValidLimits(["Over15", "Over18", "Over21"], {"from": account})
    tx.wait(1)


def deploy_afterparty():
    account = get_account()
    publish_source = False
    sbt_badge = POPD[-1]
    ageverifier = AgeVerifier[-1]
    afterparty = AfterpartySBT.deploy(
        sbt_badge.address,
        ageverifier.address,
        afterpartyUri,
        {"from": account},
        publish_source=publish_source,
    )

def deploy_age_verifier():
    account = get_account()
    publish_source = False
    verifier = AgeVerifier.deploy(
        {"from": account},
        publish_source=publish_source,
    )

def verify_age():
    verifier = AgeVerifier[-1]
    print(verifier.verifyProof(proof, public_inputs))

def store_age_proof():
    account = get_account()
    sbt = POPD[-1]
    tx = sbt.mintBadge({"from": account})
    tx.wait(1)
    tx = sbt.storeAgeProof(proof, public_inputs, "Over18", {"from": account})
    tx.wait(1)
    print(sbt.getAgeProofByLimit(account, "Over18"))

def test_verify_age():
    account = get_account()
    verifier = AgeVerifier[-1]
    popd = POPD[-1]
    (proof, public_inputs, deadline) = popd.getAgeProofByLimit("0x2470594C69e069fdd08a6E26a118A5100fF8c9C7", "Over18")
    print(verifier.verifyProof(proof, public_inputs))
    print(proof, public_inputs, deadline)

def mint_ticket():
    account = get_account()
    afterparty = AfterpartySBT[-1]
    tx = afterparty.mintTicket({"from": account})
    tx.wait(1)

proofArea = 0x1d0007c34cad3a357b728638cf6441bc3bae6d9168d14e9715da22808d0ca69524435ff8b8b5a2442df58869d6f0649bad89db949fec2b9be4ed25c56ccb46071de733f8b7627114cb75fc40d009f0dac9f919022ac3cdabdde6addbe942594330309969263791eedada4127579ac6e9b9997a959befe08f9804af237b7757a72f63917b2831bcf738adc1af1fbd850a135e10a7c6ba9dc10d0d5a527df67a182be7d06be273625bd667a4a19974863dce18d443105257e90d95b3c71ac7bbf71a1ed4c80c28448226587214587a36ecdec3f07e037f649313a1ef042ae75d5c1d5e68718c5d3e0e4e5b0fb6518d00520f77b6f8e83fea6bf154ada1ce818abe059f293472d187e30858af83a27fcb46fd2290488deafee4d85c40f973c38608161f9123b3934e6de182206c9bb1a4901339c36ca0cabad3e6cdffe370ae8fe2246cfad0995ccdeee8de1fb63a796ab6704b3d4cde09a3e51ba9b8a35fb0932e2a5bc8ef1ca9d669cad67dd685b5a022d2420719f4d6651e5688a4623175f54a2e0fc3073c28372e6c3bf8277579e6395160749bb180ab30a3875008161d4c60025b2f33ca3191ffb880f36442791af46798c9ec3167d8416b11aec87fb206d41bda499a30c14dc7dbb493beff279e17e3e1355cceeed610728b82a1bebe651a18c5dc65decf7a770e735bc27893995f8ebebec0609f8bf9a1bd1a97f59a0c1f24c544cfe80c802eb1bc086cca720520a62f4df56a237ea0a63b31cefe5bea420f0153cfd7ccfb7394c3fdddac6211048985a6e23c0a81af66ccee4fd1856ff827b1d346a0a3b07e79c58899f725a8d42a8a020ca847a1b8c02fe437e77097c3158f69c19948ea198207ecf5a214443d2807d104950447c3167ac210f3ca4ac11a589bf093336ff5d57d0de816770eebe966d0064eb050c77f2de78c26c652420acccb900e1152453b8895dce59df707cf382ac47d78cad2a33473c3a669633a188d33245b66aa912f4cd40f00c0f23ce700e5ed2ee7b45fb450aa078344ed1129093a3d39995b465d52439358f60bd10a9bd7218fd5ae3d3c3335ad9aaaa983039fed226497a341db86bfbd4470bd129691d36b39fb4c7b11c0d9f76669a8f4
publicInputsArea = ["0x0000000000000000000000000000000000000000000000000000000000000001","0x0000000000000000000000000000000000000000000000000000000000000012","0x0000000000000000000000000000000000000000000000000000000000000015","0x000000000000000000000000000000000000000000000000000000000000004c","0x00000000000000000000000000000000000000000000000000000000000000ac"]

# Add area functionality to contract

def deploy_area_verifier():
    account = get_account()
    publish_source = False
    verifier = AreaVerifier.deploy(
        {"from": account},
        publish_source=publish_source,
    )

def verify_area():
    verifier = AreaVerifier[-1]
    print("Verify area: ", verifier.verifyProof(proofArea, publicInputsArea))


def main():
    deploy()
    deploy_age_verifier()
    deploy_afterparty()
    #verify_age()
    store_age_proof()
    mint_ticket()
    #test_verify_age()
    deploy_area_verifier()
    verify_area()

