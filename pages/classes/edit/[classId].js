import Layout from "@/components/Layout"
import ClassForm from "@/components/ClassForm"
import mongooseConnect from "@/lib/mongoose"
import { Class } from "@/models/class"
import { License } from "@/models/license"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default function EditClass({ cls, license, licensesOfSameProgram }) {
  return (
    <Layout>
      <ClassForm cls={cls} license={license} licensesOfSameProgram={licensesOfSameProgram} />
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