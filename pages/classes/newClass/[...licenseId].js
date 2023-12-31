import Layout from "@/components/Layout"
import { License } from "@/models/license"
import mongooseConnect from "@/lib/mongoose"
import ClassForm from "@/components/ClassForm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default function NewClass({ license, licensesOfSameProgram }) {
    if (!license || licensesOfSameProgram?.length === 0) return

    return (
        <Layout>
            <ClassForm license={license} licensesOfSameProgram={licensesOfSameProgram} />
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