import { Program } from "@/models/program";
import mongooseConnect from "@/lib/mongoose"
import { isAdminRequest } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    await isAdminRequest(req, res)


    if (method === "GET") {
        const programs = await Program.find()
        res.status(200).json(programs)
    }

    if (method === "POST") {
        const { name, code, length, cost, effectiveOn, expiresOn } = req.body
        const programDoc = await Program.create({
            programName: name,
            programCode: code,
            programLength: length,
            programCost: cost,
            effectiveOn,
            expiresOn,
        })

        res.json(programDoc)
    }

}
