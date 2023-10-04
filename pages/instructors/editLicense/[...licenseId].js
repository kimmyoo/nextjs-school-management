import Layout from "@/components/Layout"
import { Program } from "@/models/program"
import { License } from "@/models/license"
import mongooseConnect from "@/lib/mongoose"
import { useState } from "react"
import { isLicenseFormValid } from "@/lib/validation"
import axios from "axios"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default function EditLicense({ license, programs }) {
    const [selectedProgram, setSelectedProgram] = useState(license.program)
    const [licenseNum, setLicenseNum] = useState(license.licenseNum)

    const [redirect, setRedirect] = useState(false)
    const [formErrors, setFormErrors] = useState({})

    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = {
            programId: selectedProgram,
            licenseNum,
            licenseId: license._id
        }

        console.log(formData)
        if (!isLicenseFormValid(formData, setFormErrors)) {
            return
        }

        try {
            await axios.patch(`/api/licenses/${license._id}`, formData)
        }
        catch (err) {
            console.log('form submission error:', err.response)
        }
        setRedirect(true)
    }


    if (redirect) {
        router.push(`/instructors/${license.instructor._id}`)
    }

    return (
        <Layout>
            <h4>Edit {license.instructor.instructorName}'s License</h4>
            <form className="flex flex-col">
                <label htmlFor="programSelect">Program</label>
                <select id="programSelect" value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)}>
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

    const { licenseId } = context.query
    await mongooseConnect()

    const programs = await Program.find({}, null, {
        sort: {
            "programName": 1,
        }
    })
    const license = await License.findOne({ _id: licenseId }).populate('instructor')
    return {
        props: {
            programs: JSON.parse(JSON.stringify(programs)),
            license: JSON.parse(JSON.stringify(license))
        }
    }
}