import { useSession } from "next-auth/react"
import Layout from "@/components/Layout"

export default function Home() {
  const { data: session } = useSession()

  return <Layout >
    <div className="flex justify-between">
      <h2>Dashboard</h2>
      <div >
        <div className="flex">
          User: <img src={session?.user?.image} alt="" className="w-6 h-6" />
          <p>{session?.user?.name}</p>
        </div>
        {session?.user?.email}
      </div>
    </div>
  </Layout>

}
