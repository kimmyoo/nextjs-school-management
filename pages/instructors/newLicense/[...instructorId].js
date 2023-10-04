import Layout from "@/components/Layout"
import mongooseConnect from "@/lib/mongoose"
import { Program } from "@/models/program"
import { Instructor } from "@/models/instructor"
import { useState } from "react"
import axios from "axios"
import { isLicenseFormValid } from "@/lib/validation"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default function NewLicense({ programs, instructor }) {

  const [selectedProgram, setSelectedProgram] = useState('')
  const [licenseNum, setLicenseNum] = useState('')
  const [redirect, setRedirect] = useState(false)
  const [formErrors, setFormErrors] = useState({})


  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = {
      programId: selectedProgram,
      instructorId: instructor._id,
      licenseNum,
    }

    if (!isLicenseFormValid(formData, setFormErrors)) {
      return
    }

    try {
      await axios.post('/api/licenses/', formData)
    }
    catch (err) {
      console.log('form submission error:', err.response)
    }
    setRedirect(true)
  }


  if (redirect) {
    router.push(`/instructors/${instructor._id}`)
  }

  return (
    <Layout>
      <h4>Add New License to instructor, {instructor.instructorName}</h4>
      <form className="flex flex-col">
        <label htmlFor="programSelect">Program</label>
        <select
          id="programSelect"
          value={selectedProgram}
          onChange={e => setSelectedProgram(e.target.value)}
        >
          <option value="">Select</option>
          {
            programs.map(program =>
              <option
                key={program._id}
                value={program._id}
              >
                {program.programName}
              </option>)
          }
        </select>

        <label htmlFor="licNum">License Number</label>
        <input
          id="licNum"
          type="text"
          value={licenseNum}
          onChange={e => setLicenseNum(e.target.value)}
        />

      </form>
      <div className="flex justify-between">
        <button
          className="btn-primary"
          onClick={handleSubmit}
        >
          Save License
        </button>
      </div>
    </Layout>
  )
}



// to get id from query, use context instead of router.
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

  const { instructorId } = context.query
  await mongooseConnect()

  const programs = await Program.find({}, null, {
    sort: {
      "programName": 1,
    }
  })
  const instructor = await Instructor.findOne({ _id: instructorId })
  return {
    props: {
      programs: JSON.parse(JSON.stringify(programs)),
      instructor: JSON.parse(JSON.stringify(instructor))
    }
  }
}