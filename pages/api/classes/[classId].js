import mongooseConnect from "@/lib/mongoose"
import { Class } from "@/models/class";





export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    const { classId } = req.query

    if (!classId) {
        return res.status(400).json({ message: "missing or invalid classId" })
    }

    if (method === "GET") {
        const cls = await Class.findOne({ _id: classId }).populate('students').populate('program').populate('license')
        if (!cls) {
            return res.status(200).json({ message: "class not found" })
        }
        res.status(200).json(cls)
    }



    if (method === "PATCH") {
        const formData = req.body
        const { _id, classCode } = formData
        const classWithSameCode = await Class.findOne({ classCode })

        if (classWithSameCode && classWithSameCode._id.toString() !== _id) {
            // console.log(classWithSameCode, _id)
            return res.status(409).json({ message: "duplicate class code" })
        } else {
            await Class.updateOne({ _id: classId }, formData)
            return res.json({ message: "instructor updated successfully." })
        }
    }
}
