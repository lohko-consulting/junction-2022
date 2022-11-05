import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs';
const snarkjs = require("snarkjs");
import path from 'path';
const ff = require('ffjavascript');
const { unstringifyBigInts } = ff.utils;

type Data = {
  verificationStatus: boolean,
  proof?: any
}

async function run(uid: string) {

    // GET USER DATABASE FILE
    const database = await fetch('http://localhost:3000/database.json').then((response) => response.json())

    // FIND MATCH BASED ON UNIQUE USER ID (wallet address)
    const match = database.filter(function(item: any) {
        return item.uid == uid.toLowerCase();
    })

    if (match.length === 0) return {success: false, proof: ""}

    // GET USER AGE FROM MATCH OBJECT
    const userAge = match[0].age
    console.log(userAge)

    const cirDirectory = path.join(process.cwd(), 'lib/circuits/');

    try {
        const { proof, publicSignals } = await snarkjs.plonk.fullProve({"userAge": userAge, "ageConstraint": 18}, cirDirectory+"proveage.wasm", cirDirectory+"proveage_final.zkey");
        const fileContents = await fs.readFile(cirDirectory + '/verification_key.json', 'utf8');
        const vKey = JSON.parse(fileContents);
        const res = await snarkjs.plonk.verify(vKey, publicSignals, proof);

        // required to generate solidity call params
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);

        // Generate solidity compatible params for Verifier.sol 
        const callData = await snarkjs.plonk.exportSolidityCallData(
            editedProof,
            editedPublicSignals,
        );

        console.log(typeof callData)

        if (res === true) {
            // Verification successful, age over the limit
            return {success: true, callData: callData}
        } else {
            // Verification successful, age under the limit
            return {success: false, proof: ""}
        }
      } catch (err) {
        // Verification failed
        console.log("Error")
        return {success: false, proof: ""}
      }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    const id = req.query.uid
    let proof;

    console.log(id)
    
    if (id) {
        // @ts-ignore
        proof = await run(id)

        if (proof.success) {
            res.status(200).json({ verificationStatus: proof.success, proof: proof })
        } else {
            res.status(200).json({ verificationStatus: false })
        }
    } else {
        res.status(400).json({ verificationStatus: false })
    }
}
