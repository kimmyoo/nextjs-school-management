import Layout from "@/components/Layout"
import { Class } from "@/models/class"
import { Instructor } from "@/models/instructor"
import mongooseConnect from "@/lib/mongoose"
import Link from "next/link"

export default function ClassDetail({ cls, instructor }) {
    return (
        <Layout>
            <div className="flex justify-between">
                <h2>Class Detail Page</h2>
                {
                    cls.status && <div><Link className="new-link" href={`/classes/enroll/${cls._id}`}>Enroll</Link></div>
                }
            </div>
            <div className="flex gap-3 justify-center">
                <h4 className="text-center">{cls.program.programName} - {cls.classCode.toUpperCase()}</h4>
                <Link href={`/classes/edit/${cls._id}`}>
                    <small className="bg-blue-200 rounded-md px-2">Edit</small>
                </Link>
            </div>
            <p className="flex justify-center gap-3">
                <span>Instructor: {instructor.instructorName}-{cls.license.licenseNum}</span>
                <span>From: {cls.begin.split('T')[0]}</span>
                <span>To: {cls.begin.split('T')[0]}</span>
                <span>Schedule: {cls.schedule.toUpperCase()}</span>
                <span>Status: {cls.status ? "Open" : "Closed"}</span>
            </p>

            {
                cls.students?.length > 0 &&
                <table className="table-auto text-left w-full">
                    <thead>
                        <tr>
                            <th>last Name, First Name</th>
                            <th>Phone</th>
                            <th>DOB</th>
                            <th>Last 4 digits</th>
                            <th className="text-center">Gender</th>
                            <th className="text-center">Address</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cls.students.map(student => (
                            <tr key={student._id}>
                                <td>{student.lastName}, {student.firstName}</td>
                                <td>{student.phoneNum}</td>
                                <td>{student.dob.split('T')[0]}</td>
                                <td>{student.last4Digits}</td>
                                <td className="text-center">{student.gender}</td>
                                <td>{student.address}</td>
                                <td>
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
            }

        </Layout>
    )
}



export async function getServerSideProps(context) {
    await mongooseConnect()
    const { classId } = context.query

    const cls = await Class.findOne({ _id: classId }, null).populate('program').populate('license').populate('students')
    const instructor = await Instructor.findOne({ _id: cls.license.instructor })


    return {
        props: {
            cls: JSON.parse(JSON.stringify(cls)),
            instructor: JSON.parse(JSON.stringify(instructor))
        }
    }
}