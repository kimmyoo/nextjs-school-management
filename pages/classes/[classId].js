import Layout from "@/components/Layout"
import { Class } from "@/models/class"
import { Instructor } from "@/models/instructor"
import mongooseConnect from "@/lib/mongoose"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]"
import axios from "axios"
import format from "date-fns/format"

export default function ClassDetail({ preFetchedClass, preFetachedInstructor }) {
    const [cls, setClass] = useState(preFetchedClass)
    const [instructor, setInstructor] = useState(preFetachedInstructor)
    const router = useRouter()
    const { query } = router
    const { classId } = query

    // useEffect is used to refetch data after being redirected 
    // from ClassForm component
    useEffect(() => {
        if (query.refresh) {
            axios.get(`/api/classes/${classId}`)
                .then(response => {
                    setClass(response.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [query.refresh, classId])

    return (
        <Layout>

            <div className="flex justify-between">
                <h2>Class Detail Page</h2>
                {
                    cls?.status && <div><Link className="new-link" href={`/classes/enroll/${cls?._id}`}>Enroll</Link></div>
                }
            </div>
            <div className="flex gap-3 justify-center">
                <h4 className="text-center">{cls?.program.programName} - {cls?.classCode.toUpperCase()}</h4>
                <Link href={`/classes/edit/${cls?._id}`}>
                    <small className="bg-blue-200 rounded-md px-2">Edit</small>
                </Link>
            </div>

            <p className="flex justify-center gap-3">
                <span>Instructor: {instructor.instructorName}-{cls?.license.licenseNum}</span>
                <span>From: {format(new Date(cls?.begin), 'yyyy-MM-dd')}</span>
                <span>To: {format(new Date(cls?.end), 'yyyy-MM-dd')}</span>
                <span>Schedule: {cls?.schedule.toUpperCase()}</span>
                <span>Status: {cls?.status ? "Open" : "Closed"}</span>
                {cls?.sideNote && <span>Note: {cls?.sideNote}</span>}
            </p>

            {
                cls?.students?.length > 0 && <div className="overflow-auto">
                    <table className="table-auto text-left w-full whitespace-nowrap">
                        <thead>
                            <tr>
                                <th>last, First Name</th>
                                <th>Phone</th>
                                <th>DOB</th>
                                <th>Last 4 digits</th>
                                <th className="text-center">G</th>
                                <th className="text-center">Address</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cls?.students.map(student => (
                                <tr key={student._id} className="p-3 tracking-wide">
                                    <td className="p-2">{student.lastName}, {student.firstName}</td>
                                    <td className="p-2">{student.phoneNum}</td>
                                    <td className="p-2">{student.dob.split('T')[0]}</td>
                                    <td className="p-2">{student.last4Digits}</td>
                                    <td className="p-2 text-center">{student.gender}</td>
                                    <td>{student.address}</td>
                                    <td className="p-2">
                                        <Link
                                            href={`/students/${student._id}`}
                                            className="nooutline-link"
                                        >
                                            more
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
    const { classId } = context.query
    const cls = await Class.findOne({ _id: classId }, null).populate('program').populate('license').populate('students')
    const instructor = await Instructor.findOne({ _id: cls?.license.instructor })
    return {
        props: {
            preFetchedClass: JSON.parse(JSON.stringify(cls)),
            preFetachedInstructor: JSON.parse(JSON.stringify(instructor))
        }
    }
}