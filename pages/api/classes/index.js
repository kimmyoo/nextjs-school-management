import { Class } from "@/models/class";
import mongooseConnect from "@/lib/mongoose"
import { isAdminRequest } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    await isAdminRequest(req, res)
    // if (method === "GET") {
    //     const classes = await Class.find()
    //     res.status(200).json(classes)
    // }

    if (method === "POST") {
        const formData = req.body
        const { classCode } = formData
        const foundClass = await Class.findOne({ classCode })
        if (foundClass) {
            return res.status(409).json({ message: "duplicate class code" })
        }
        const classDoc = await Class.create(formData)
        res.json(classDoc)
    }

}
