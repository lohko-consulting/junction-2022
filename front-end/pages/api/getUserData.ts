import type { NextApiRequest, NextApiResponse } from 'next'

type UserData = {
    success: boolean;
    firstName?: string;
    lastName?: string;
    age?: number;
    country?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserData>
) {

    const id = req.query.uid
    let proof;

    console.log(id)
    
    if (id) {
        // GET USER DATABASE FILE
        const database = await fetch('http://localhost:3000/database.json').then((response) => response.json())
    
        // FIND MATCH BASED ON UNIQUE USER ID (wallet address)
        const match = database.filter(function(item: any) {
            // @ts-ignore
            return item.uid == id?.toLowerCase();
        })

        if (match && match.length > 0) {
            res.status(200).json({
                success: true,
                firstName: match[0].firstName,
                lastName: match[0].lastName,
                age: match[0].age,
                country: match[0].country,
            })
        }

    } else {
        res.status(400).json({success: false})
    }
}
