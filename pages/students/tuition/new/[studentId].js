import Layout from "@/components/Layout"
import { Student } from "@/models/student"
import mongooseConnect from "@/lib/mongoose"
import { useEffect, useState } from "react"
import { nanoid } from "nanoid"
import { isTransactionFormValid } from "@/lib/validation"
import axios from "axios"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default function NewPayment({ student }) {
  const router = useRouter()
  // sort classes by begin date so the most recent classes
  // stays on top of select option list
  const sortedClasses = student.classes.sort((a, b) => {
    return new Date(b.begin) - new Date(a.begin)
  })

  const [selectedClass, setSelectedClass] = useState('')
  const [amount, setAmount] = useState('')
  const [tNote, setTNote] = useState('')
  const [tNumber, setTNumber] = useState('')
  const [isRefund, setIsRefund] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [redirect, setRedirect] = useState(false)

  // set tNumber based on transaction type and class selected
  useEffect(() => {
    const cls = student.classes.find(cls => cls._id === selectedClass)
    if (isRefund) {
      setTNumber(`r-${cls ? cls.classCode : ""}-${student.uniqueId.slice(0, 4)}-${nanoid().slice(-4)}`)
    } else {
      setTNumber(`p-${cls ? cls.classCode : ""}-${student.uniqueId.slice(0, 4)}-${nanoid().slice(-4)}`)
    }
  }, [isRefund, selectedClass, student])

  const handleSelectChange = (e) => {
    setSelectedClass(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = {
      student: student._id,
      class: selectedClass,
      amount,
      tNumber,
      isRefund,
      tNote,
    }
    // console.log(formData)
    if (!isTransactionFormValid(formData, setFormErrors)) {
      return
    }

    axios.post('/api/transactions/', formData)
      .then(response => {
        console.log(response.data)
        setRedirect(true)
      })
      .catch(err => {
        console.error(err.response.data)
      })
  }


  if (redirect) {
    router.push(`/students/${student._id}`)
  }


  return (
    <Layout>
      <div>
        <h4>New Transaction of Student - {student.lastName}, {student.firstName}</h4>
        <div>
          <label htmlFor="classSelect">for class: </label>
          <select
            name="classSelect"
            id="classSelect"
            value={selectedClass}
            onChange={handleSelectChange}
          >
            <option value="">select class</option>
            {
              student.classes.length > 0 && sortedClasses.map(cls => (
                <option
                  key={cls._id}
                  value={cls._id}
                >
                  {cls.classCode}
                </option>
              ))
            }
          </select>
          {formErrors.selectedClass && <span className="formError">{formErrors.selectedClass}</span>}
        </div>
        <form className="flex flex-col">
          <div className="flex">
            <label>Transaction Type</label>
          </div>
          <select
            name="isRefund"
            id="isRefund"
            value={isRefund}
            onChange={e => setIsRefund(e.target.value === "true")}
          >
            <option value="false">Payment</option>
            <option value="true">Refund</option>
          </select>

          <div className="flex">
            <label>Transaction Number</label>
            {formErrors.tNumber && <span className="formError">{formErrors.tNumber}</span>}
          </div>
          <input
            type="text"
            name="tNumber"
            value={tNumber}
            disabled
          />

          <div className="flex">
            <label>Amount</label>
            {formErrors.amount && <span className="formError">{formErrors.amount}</span>}
          </div>
          <input
            type="text"
            name="amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="$"
          />
          <div className="flex">
            <label>Note</label>
            {formErrors.tNote && <span className="formError">{formErrors.tNote}</span>}
          </div>
          <input
            type="text"
            name="tNote"
            value={tNote}
            onChange={e => setTNote(e.target.value)}
          />
        </form>
        <button
          type="button"
          className="btn-primary"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </Layout >
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
  const student = await Student.findOne({ _id: studentId }).populate('classes')

  return {
    props: {
      student: JSON.parse(JSON.stringify(student))
    }
  }
}
