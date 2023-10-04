import Layout from "@/components/Layout"
import mongooseConnect from "@/lib/mongoose"
import { Student } from "@/models/student"
import { isValidObjectId } from "@/lib/validation"
import StudentForm from "@/components/StudentForm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default function EditStudent({ student }) {

    if (!student) return

    return (
        <Layout>
            <h2>Edit Student Page</h2>
            <StudentForm student={student} />
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }

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
