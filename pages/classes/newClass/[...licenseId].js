import Layout from "@/components/Layout"
import { License } from "@/models/license"
import mongooseConnect from "@/lib/mongoose"
import ClassForm from "@/components/ClassForm"
import { getSession } from "next-auth/react"

export default function NewClass({ license, licensesOfSameProgram }) {
    if (!license || licensesOfSameProgram?.length === 0) return

    return (
        <Layout>
            <ClassForm license={license} licensesOfSameProgram={licensesOfSameProgram} />
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
    const { licenseId } = context.query
    const license = await License.findOne({ _id: licenseId }, null).populate('program').populate('instructor')
    const licensesOfSameProgram = await License.find({ program: license.program._id }, null).populate('instructor')
    return {
        props: {
            license: JSON.parse(JSON.stringify(license)),
            licensesOfSameProgram: JSON.parse(JSON.stringify(licensesOfSameProgram))
        }
    }
}