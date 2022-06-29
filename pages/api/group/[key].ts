// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../db/client';


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const key = req.query["key"];
    if (!key || typeof key !== "string") {
        res.statusCode = 400;
        res.send(JSON.stringify({ message: "Please enter a key" }));
        return;
    }
    const check = await prisma.group.findFirst({
        where: {
            key
        }
    });
    if (!check) {
        res.statusCode = 400;
        res.send(JSON.stringify({ message: "No group found" }));
        return;
    }
    res.statusCode = 200;
    res.send(JSON.stringify({ message: `Group found: ${check.key}` }));
}

