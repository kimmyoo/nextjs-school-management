import { Class } from "@/models/class";
import mongooseConnect from "@/lib/mongoose"
import { isAdminRequest } from "../../auth/[...nextauth]";


export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect()
    await isAdminRequest(req, res)

    if (method === "POST") {
        const searchQuery = req.query.q
        const searchRegex = new RegExp(searchQuery, 'i')

        const classes = await Class.find(
            {
                $or: [
                    { classCode: searchRegex },
                ]
            }
        )
        res.status(200).json(classes)
    }
}
