import { Student } from "@/models/student";
import { Class } from "@/models/class";
import mongooseConnect from "@/lib/mongoose"
import { isAdminRequest } from "../auth/[...nextauth]";


export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    await isAdminRequest(req, res)

    if (method === "PATCH") {
        const { _id, formData, classes, classesRemoved } = req.body
        const { uniqueId } = formData
        // console.log(uniqueId)
        const foundStudent = await Student.findOne({ uniqueId })
        // .toString() is needed
        if (foundStudent && foundStudent._id.toString() !== _id) {
            return res.status(409).json({ foundStudent, message: "Duplicate unique ID" })
        }
        const studentDoc = await Student.updateOne({ _id }, { ...formData, classes })
        // need to delete this student's ObjectId from every classDoc.students array
        // but only perform this update when needed.
        if (classesRemoved.length > 0) {
            try {
                const studentIdToDelete = _id
                // use filter to find class documents that has this studentId
                const filter = { 'students': studentIdToDelete }
                // Use the $pull operator to remove the specific ObjectId 
                // from the array in multiple documents that match the filter.
                const update = { $pull: { 'students': studentIdToDelete } }
                const options = { multi: true }

                const result = await Class.updateMany(filter, update, options)
                console.log(`${result.modifiedCount} Class documents updated`)

            } catch (err) {
                console.log(err)
            }
        }
        res.status(200).json(studentDoc)
    }
}
