import Layout from "@/components/Layout"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "axios"
import { isValidObjectId } from "@/lib/validation"
import ProgramForm from "@/components/ProgramForm"

export default function EditProgram() {
    const router = useRouter()
    const { id } = router.query
    const [program, setProgram] = useState(null)

    useEffect(() => {
        if (router.isReady) {
            axios.get(`/api/programs/${id}`)
                .then(response => {
                    setProgram(response.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [id, router.isReady])

    if (!id || !isValidObjectId(id)) {
        return <Layout>
            <h2>Something wrong, Invalid programId</h2>
        </Layout>
    }

    return (
        <Layout>
            <h2>Edit {program?.programName} Program </h2>
            {/* this is && is needed to prevent program is null */}
            {/* then props passed to child component will be null */}
            {program && <ProgramForm program={program} />}
        </Layout>
    )
}
