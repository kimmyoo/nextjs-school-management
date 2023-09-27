import Layout from "@/components/Layout"
import mongooseConnect from "@/lib/mongoose"
import { Student } from "@/models/student"
import { isValidObjectId } from "@/lib/validation"

export default function EditStudent({ student }) {
    return (
        <Layout>
            <h2>Edit Student</h2>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const { studentId } = context.query
    if (!studentId || !isValidObjectId(studentId)) return null

    await mongooseConnect()
    const student = await Student.findOne({ _id: studentId }).populate('classes')
    return {
        props: {
            student: JSON.parse(JSON.stringify(student))
        }
    }
}
