
import Layout from "@/components/Layout"
import { Instructor } from "@/models/instructor"
import { License } from "@/models/license"
import mongooseConnect from "@/lib/mongoose"
import Link from "next/link"
import LicenseCard from "@/components/LicenseCard"

export default function InstructorDetail({ instructor, licenses }) {

  return (
    <Layout>
      <div>
        <div className="flex justify-between">
          <h2>Instructor Detail</h2>
          <div className="mt-2">
            <Link
              href={`/instructors/newLicense/${instructor._id}`}
            >
              <span
                className="new-link"
              >
                Add License
              </span>
            </Link>
          </div>
        </div>

        <div>Name: {instructor.instructorName}</div>
        <div>Tel: {instructor.instructorPhoneNum}</div>
        <div>Email: {instructor.instructorEmail}</div>

        {
          licenses.length > 0
            ? <div className="cards-container">
              {
                licenses?.map(lic => < LicenseCard license={lic} key={lic._id} />)
              }
            </div>
            : <h4 className="text-red-400">No license yet</h4>
        }

      </div>
    </Layout>
  )
}


export async function getServerSideProps(context) {
  const { instructorId } = context.query
  await mongooseConnect()
  const instructor = await Instructor.findOne({ _id: instructorId }, null)
  const licenses = await License.find({ instructor: instructorId }, null, {
    sort: {
      "program": 1,
    }
  }).populate('program')

  return {
    props: {
      instructor: JSON.parse(JSON.stringify(instructor)),
      licenses: JSON.parse(JSON.stringify(licenses))
    }
  }
}