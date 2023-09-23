import { License } from "@/models/license";
import mongooseConnect from "@/lib/mongoose"



export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();

    const { licenseId } = req.query

    if (!licenseId) {
        return res.status(400).json({ message: "missing or invalid licenseId" })
    }


    // PUT request to update single license object
    if (method === "PATCH") {
        const { licenseId, licenseNum, programId } = req.body
        await License.updateOne({ _id: licenseId }, {
            licenseNum,
            program: programId,
        })
        res.json({ message: "license updated successfully." })
    }

    // DELETE request to delete license object
    // if (method === "DELETE") {
    //     await License.deleteOne({ _id: licenseId })
    //     res.status(200).json({ message: "license is deleted." })
    // }


}
