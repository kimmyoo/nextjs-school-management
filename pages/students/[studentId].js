import Layout from "@/components/Layout"
import mongooseConnect from "@/lib/mongoose"
import { Student } from "@/models/student"
import StudentCard from "@/components/StudentCard"

export default function StudentDetail({ student }) {
    if (!student) return

    return (
        <Layout>
            <h2>Student Detail Page</h2>
            <div className="flex justify-center items-center">
                <StudentCard student={student} />
            </div>
        </Layout>
    )
}


export async function getServerSideProps(context) {

    await mongooseConnect()
    const { studentId } = context.query
    const student = await Student.findOne({ _id: studentId }).populate('classes')



    return {
        props: {
            student: JSON.parse(JSON.stringify(student))
        }
    }
}