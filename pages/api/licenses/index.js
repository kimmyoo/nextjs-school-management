import { Instructor } from "@/models/instructor";
import { License } from "@/models/license";
import mongooseConnect from "@/lib/mongoose"
import { isAdminRequest } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();
    await isAdminRequest(req, res)

    if (method === "GET") {
        const licenses = await License.find().populate('program', 'instructor').exec()
        res.status(200).json(licenses)
    }

    if (method === "POST") {
        const { instructorId, programId, licenseNum } = req.body
        const license = await License.create({
            licenseNum,
            program: programId,
            instructor: instructorId
        })

        console.log(license._id)
        const instructor = await Instructor.findOne({ _id: instructorId }).exec()
        instructor.licenses.push(license._id)
        instructor.save()

        res.json(license)
    }

}
