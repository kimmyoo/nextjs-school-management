import { useSession } from "next-auth/react"
import Layout from "@/components/Layout"
import { Student } from "@/models/student";
import { Transaction } from "@/models/transaction";
import { Class } from "@/models/class";
import Link from "next/link";
import ClassCard from "@/components/ClassCard";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import format from "date-fns/format";
import mongooseConnect from "@/lib/mongoose"

export default function Home({ students, classes, transactions }) {
  const { data: session } = useSession()
  // a reducer function passed to transactions.reduce()
  const reducer = (total, trans) => {
    return total + (trans.isRefund ? trans.amount * -1 : trans.amount)
  }
  return <Layout >
    <div className="flex justify-between">
      <h2>Dashboard</h2>
      <div >
        <div className="flex">
          User:
          <p>{session?.user?.name}</p>
        </div>
        {session?.user?.email}
      </div>
    </div>
    <div className="dashboard-cards-container">
      <div className="dashboard-card">
        <h4>Current Open Classes</h4>
        <div className="flex gap-2 flex-wrap">
          {
            classes.length > 0 ? classes.map((cls, index) => (
              <ClassCard key={cls._id} cls={cls} />
            )) : <p>no open classes for registration yet.</p>
          }
        </div>
      </div>
      <div className="dashboard-card">
        <h4>Today&apos;s Student Registration</h4>
        <div className="flex flex-wrap gap-1">
          {
            students.length > 0 ? students.map((student, index) => (
              <p key={student._id}>{index + 1}. {student.lastName}, {student.firstName} <Link className="nooutline-link" href={`/students/${student._id}`}>Details</Link></p>
            )) : <p>no student registration yet today.</p>
          }
        </div>
      </div>
    </div>

    <div className="m-3 rounded-md p-4 shadow-lg">
      <h4>Tutition Transactions</h4>
      <table className="table-auto text-left w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Student</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Ref Number</th>
          </tr>
        </thead>
        <tbody>
          {
            transactions.length > 0 ? transactions.map(trans => (
              <tr key={trans._id}>
                <td>{format(new Date(trans.createdAt), 'yyyy-MM-dd, hh:mm')}</td>
                <td>{trans.student.lastName}, {trans.student.firstName}</td>
                <td className={trans.isRefund ? "text-red-500" : "text-green-600"}>{trans.isRefund ? "refund" : "payment"}</td>
                <td className={trans.isRefund ? "text-red-500" : "text-green-600"}>${trans.isRefund ? "(" + trans.amount + ")" : trans.amount}</td>
                <td>{trans.tNumber}</td>
              </tr>
            )) : <tr>
              <td>No income yet today</td>
            </tr>
          }
        </tbody>
      </table>

      <p className="text-right">Net Income: {
        transactions.reduce(reducer, 0)
      }</p>
    </div>
  </Layout>
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
  const ongoingClasses = await Class.find({ status: true }, null, {
    sort: {
      "programName": 1,
    }
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todaysTransactions = await Transaction.find({
    createdAt: {
      $gte: today
    }
  }).populate('student')

  const todaysStudents = await Student.find({
    createdAt: {
      $gte: today
    }
  })

  return {
    props: {
      classes: JSON.parse(JSON.stringify(ongoingClasses)),
      transactions: JSON.parse(JSON.stringify(todaysTransactions)),
      students: JSON.parse(JSON.stringify(todaysStudents))
    }
  }
}