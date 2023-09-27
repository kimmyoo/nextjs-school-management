import { Class } from "@/models/class";
import mongooseConnect from "@/lib/mongoose"


export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    // if (method === "GET") {
    //     const classes = await Class.find()
    //     res.status(200).json(classes)
    // }

    if (method === "POST") {
        const formData = req.body
        const classDoc = await Class.create(formData)
        res.json(classDoc)
    }

}
