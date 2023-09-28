import { Class } from "@/models/class";
import mongooseConnect from "@/lib/mongoose"



export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    const { classId } = req.query

    if (!classId) {
        return res.status(400).json({ message: "missing or invalid classId" })
    }

    if (method === "PATCH") {
        const formData = req.body
        await Class.updateOne({ _id: classId }, formData)
        res.json({ message: "instructor updated successfully." })
    }
}
