import { Program } from "@/models/program";
import mongooseConnect from "@/lib/mongoose"
import { isAdminRequest } from "../auth/[...nextauth]";



export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    await isAdminRequest(req, res)

    const { programId } = req.query

    if (!programId) {
        return res.status(400).json({ message: "missing or invalid programId" })
    }


    // GET requset to retrieve single program object
    if (method === "GET") {
        const program = await Program.findOne({ _id: programId })
        res.status(200).json(program)
    }


    // PUT request to update single program object
    if (method === "PUT") {
        const { _id, name, code, length, cost, effectiveOn, expiresOn, isActive } = req.body
        await Program.updateOne({ _id }, {
            programName: name,
            programCode: code,
            programLength: length,
            programCost: cost,
            effectiveOn,
            expiresOn,
            isActive,
        })
        res.json({ message: "program updated successfully." })
    }

    // DELETE request to delete program object

    if (method === "DELETE") {
        await Program.deleteOne({ _id: programId })
        res.status(200).json({ message: "program is deleted." })
    }


}
