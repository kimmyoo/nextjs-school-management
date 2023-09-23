import Layout from "@/components/Layout"
import { License } from "@/models/license"
import mongooseConnect from "@/lib/mongoose"

export default function NewClass() {
    return (
        <Layout>
            <h2>New Class</h2>
        </Layout>
    )
}


export async function getServerSideProps(context) {
    await mongooseConnect()
    const { licenseId } = context.query
    const license = await License.findOne({ _id: licenseId }, null).populate('program').populate('instructor')
    return {
        props: {
            license: JSON.parse(JSON.stringify(license))
        }
    }
}