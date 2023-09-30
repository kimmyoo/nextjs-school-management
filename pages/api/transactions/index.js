import { Student } from "@/models/student";
import { Transaction } from "@/models/transaction";

import mongooseConnect from "@/lib/mongoose"


export default async function handler(req, res) {
    const { method } = req
    await mongooseConnect();


    if (method === "POST") {
        const formData = req.body
        const { student: studentId } = formData
        const student = await Student.findOne({ _id: studentId }).exec()
        const transactionDoc = await Transaction.create(formData)
        student.transactions.push(transactionDoc._id)
        await student.save()
        res.status(200).json(transactionDoc)
    }
}
