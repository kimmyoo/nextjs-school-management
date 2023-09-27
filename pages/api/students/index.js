import { Student } from "@/models/student";
import { Class } from "@/models/class";
import mongooseConnect from "@/lib/mongoose"


export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();

    // if (method === "GET") {
    //     const instructors = await Instructor.find().populate('licenses')
    //     res.status(200).json(instructors)
    // }

    if (method === "POST") {
        const { formData, classId } = req.body
        const studentDoc = await Student.create(formData)

        const cls = await Class.findOne({ _id: classId }).exec()

        await cls.students.push(studentDoc._id)
        cls.save()

        res.status(200).json(studentDoc)
    }

}
