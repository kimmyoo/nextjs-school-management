import Layout from "@/components/Layout"
import ClassForm from "@/components/ClassForm"
import mongooseConnect from "@/lib/mongoose"
import { Class } from "@/models/class"
import { License } from "@/models/license"
import { getSession } from "next-auth/react"

export default function EditClass({ cls, license, licensesOfSameProgram }) {
    return (
        <Layout>
            <ClassForm cls={cls} license={license} licensesOfSameProgram={licensesOfSameProgram} />
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
    const { classId } = context.query
    const cls = await Class.findOne({ _id: classId }, null).populate('program')
    const license = await License.findOne({ _id: cls.license }).populate('program')
    // console.log(license)
    const licensesOfSameProgram = await License.find({ program: license.program._id }, null).populate('instructor')
    return {
        props: {
            license: JSON.parse(JSON.stringify(license)),
            licensesOfSameProgram: JSON.parse(JSON.stringify(licensesOfSameProgram)),
            cls: JSON.parse(JSON.stringify(cls))
        }
    }
}