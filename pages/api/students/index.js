import { Student } from "@/models/student";
import { Class } from "@/models/class";
import mongooseConnect from "@/lib/mongoose"


export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();

    // if (method === "GET") {
    //     const students = await Student.find()
    //     res.status(200).json(students)
    // }

    if (method === "POST") {
        const { formData, classId, classes } = req.body
        const { uniqueId } = formData

        const foundStudent = await Student.findOne({ uniqueId })
        if (foundStudent) {
            return res.status(409).json({ foundStudent, message: "duplicate Unique ID" })
        }

        const studentDoc = await Student.create({ ...formData, classes })
        const cls = await Class.findOne({ _id: classId }).exec()
        cls.students.push(studentDoc._id)
        await cls.save()

        res.status(200).json(studentDoc)
    }
}
