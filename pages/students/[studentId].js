import Layout from "@/components/Layout"
import mongooseConnect from "@/lib/mongoose"
import { Student } from "@/models/student"
import StudentCard from "@/components/StudentCard"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]"
import Link from "next/link"
import format from "date-fns/format"

export default function StudentDetail({ student }) {
  if (!student) return

  return (
    <Layout>
      <h2>Student Detail Page</h2>
      <div className="flex justify-center items-center">
        <StudentCard student={student} />
      </div>
      <div className="flex justify-between">
        <h4>Student Transaction Record</h4>
        <Link
          className="new-link m-2"
          href={`/students/tuition/new/${student._id}`}
        >New Transaction
        </Link>
      </div>
      {/* student needs to be enrolled at least one class to proceed to payment option */}
      {
        student.transactions.length > 0
        &&
        <div>

          {
            student.transactions.length > 0
            &&
            <div className="overflow-auto">
              <table className="table-auto text-left w-full whitespace-nowrap">
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
                    <tr key={trans._id}>
                      <td className="p-2">{format(new Date(trans.createdAt), 'yyyy-MM-dd, hh:mm aaaa')}</td>
                      <td className="p-2">{trans.tNumber}</td>
                      <td className={trans.isRefund ? "text-red-500" : "text-green-600"}>{trans.isRefund ? "refund" : "payment"}</td>
                      <td className="p-2">{
                        trans.tNumber.split('-')[1]
                      }</td>
                      <td className="p-2">${trans.amount}</td>
                      <td className="p-2">{trans.tNote ? trans.tNote : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </div>
      }
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

  await mongooseConnect()
  const { studentId } = context.query
  const student = await Student.findOne({ _id: studentId }).populate('classes').populate('transactions')

  return {
    props: {
      student: JSON.parse(JSON.stringify(student))
    }
  }
}