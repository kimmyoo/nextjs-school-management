import { Student } from "@/models/student";
import mongooseConnect from "@/lib/mongoose"
import { isAdminRequest } from "../../auth/[...nextauth]";


export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    await isAdminRequest(req, res)

    if (method === "POST") {
        const searchQuery = req.query.q
        const searchRegex = new RegExp(searchQuery, 'i')

        const students = await Student.find(
            {
                $or: [
                    { lastName: searchRegex },
                    { firstName: searchRegex },
                    { uniqueId: searchRegex },
                    { last4Digits: searchRegex },
                ]
            }
        ).populate('classes')
        res.status(200).json(students)
    }
}
