import Layout from "@/components/Layout"
import mongooseConnect from "@/lib/mongoose"
import { Student } from "@/models/student"
import StudentCard from "@/components/StudentCard"
import { getSession } from "next-auth/react"
import Link from "next/link"

export default function StudentDetail({ student }) {
  if (!student) return

  return (
    <Layout>
      <h2>Student Detail Page</h2>
      <div className="flex justify-center items-center">
        <StudentCard student={student} />
      </div>
      {/* student needs to be enrolled at least one class to proceed to payment option */}
      {
        student.classes.length > 0
        &&
        <div>
          <div className="flex justify-between">
            <h4>Student's Transaction Record</h4>
            <Link
              className="new-link m-2"
              href={`/students/tuition/new/${student._id}`}
            >New Transaction
            </Link>
          </div>
          {
            student.transactions.length > 0
            &&
            <table className="table-auto text-left w-full">
              <thead>
                <tr>
                  <th>Date and Time</th>
                  <th>Ref Number</th>
                  <th>Type</th>
                  <th>class</th>
                  <th>Amount</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {student.transactions.map(trans => (
                  <tr>
                    <td>{trans.createdAt}</td>
                    <td>{trans.tNumber}</td>
                    <td>{trans.isRefund ? "refund" : "payment"}</td>
                    <td>{
                      (student.classes.find(cls => (
                        cls._id === trans.class
                      ))).classCode
                    }</td>
                    <td>${trans.amount}</td>
                    <td>{trans.tNote ? trans.tNote : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      }
    </Layout>
  )
}


export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  await mongooseConnect()
  const { studentId } = context.query
  const student = await Student.findOne({ _id: studentId }).populate('classes').populate('transactions')

  return {
    props: {
      student: JSON.parse(JSON.stringify(student))
    }
  }
}