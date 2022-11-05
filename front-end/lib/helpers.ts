import { ethers } from "ethers";
import { contractAddress as sbtAddress, abi as sbtAbi } from "./contract";

export const verifyAge = async (signer: any, id: any) => {
  let proof = await fetch("/api/verifyAge?uid=" + id).then((response) =>
    response.json()
  );

  if (proof.proof) {
    const sbtC = new ethers.Contract(sbtAddress, sbtAbi, signer);

    const [first, ...rest] = proof.proof.callData.split(",");
    let newArray = [];

    for (const item in rest) {
      newArray.push(
        rest[item]
          .replaceAll('"', "")
          .replaceAll("[", "")
          .replaceAll("]", "")
      );
    }

    try {
      const tx = await sbtC.storeAgeProof(first, newArray, "Over18");
      const receipt = await tx.wait();
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("False");
    return false;
  }
};
