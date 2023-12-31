import Layout from "@/components/Layout"
import Link from "next/link"
import ProgramCard from "@/components/ProgramCard"
import { Program } from "@/models/program"
import mongooseConnect from "@/lib/mongoose"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]"

export default function ProgramsPage({ programs }) {

  return (
    <Layout>
      <div>
        <div className="flex justify-between">
          <h2>Programs Page</h2>
          <div className="mt-2">
            <Link
              href={'/programs/new'}
              className="new-link"                        >
              New Program
            </Link>
          </div>
        </div>

        <div className="cards-container">
          {programs?.map(program => (
            <ProgramCard program={program} key={program._id} />
          ))}
        </div>
      </div>
    </Layout>
  )
}


export async function getServerSideProps(context) {
  //  document suggest: use getServerSession, faster. 
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
  const programs = await Program.find({}, null, {
    sort: {
      "programName": 1,
    }
  })
  return {
    props: {
      programs: JSON.parse(JSON.stringify(programs))
    }
  }
}