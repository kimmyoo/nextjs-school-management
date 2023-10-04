import { Instructor } from "@/models/instructor";
import mongooseConnect from "@/lib/mongoose"
import { isAdminRequest } from "../auth/[...nextauth]";


export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    await isAdminRequest(req, res)

    const { instructorId } = req.query

    if (!instructorId) {
        return res.status(400).json({ message: "missing or invalid instructorId" })
    }


    // GET requset to retrieve single instructor object
    if (method === "GET") {
        const instructor = await Instructor.findOne({ _id: instructorId })
        res.status(200).json(instructor)
    }


    // PUT request to update single instructor object
    if (method === "PATCH") {
        const { _id, name, phoneNum, email } = req.body
        await Instructor.updateOne({ _id }, {
            instructorName: name,
            instructorPhoneNum: phoneNum,
            instructorEmail: email,
        })
        res.json({ message: "instructor updated successfully." })
    }

    // DELETE request to delete instructor object
    if (method === "DELETE") {
        await Instructor.deleteOne({ _id: instructorId })
        res.status(200).json({ message: "instructor is deleted." })
    }


}
