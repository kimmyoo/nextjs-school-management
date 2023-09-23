import { Instructor } from "@/models/instructor";
import mongooseConnect from "@/lib/mongoose"


export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();


    if (method === "GET") {
        const instructors = await Instructor.find().populate('licenses')
        res.status(200).json(instructors)
    }

    if (method === "POST") {
        const { name, phoneNum, email } = req.body
        const instructorDoc = await Instructor.create({
            instructorName: name,
            instructorPhoneNum: phoneNum,
            instructorEmail: email,
            licenses: []
        })

        res.json(instructorDoc)
    }

}
