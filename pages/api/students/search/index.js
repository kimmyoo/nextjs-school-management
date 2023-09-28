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
