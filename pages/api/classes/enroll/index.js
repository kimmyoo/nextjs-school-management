import mongooseConnect from "@/lib/mongoose"
import { Class } from "@/models/class";
import { Student } from "@/models/student";

export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();

    if (method === "PATCH") {
        const { cls, selectedStudent } = req.body
        try {
            const foundClass = await Class.findOne({ _id: cls._id }).exec()
            const foundStudent = await Student.findOne({ _id: selectedStudent._id }).exec()

            if (foundClass?.students.includes(foundStudent._id)) {
                return res.status(400).json({ message: "this student is already enrolled in this class" })
            } else {
                foundClass.students.push(foundStudent._id)
                await foundClass.save()
                foundStudent.classes.push(foundClass._id)
                await foundStudent.save()
            }
        } catch (err) {
            console.log(err)
        }
        res.json({ message: "class and student updated successfully." })
    }
}
