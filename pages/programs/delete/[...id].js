import { useRouter } from "next/router"
import Layout from "@/components/Layout"
import { useEffect, useState } from "react"
import axios from "axios"

export default function DeleteProgram() {
    const router = useRouter()
    const { id } = router.query
    const [program, setProgram] = useState(null)


    useEffect(() => {

        if (!id) return

        axios.get(`/api/programs/${id}`)
            .then(response => {
                setProgram(response.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [id])

    const goBack = () => {
        router.push('/programs/')
    }

    const confirmDelete = async () => {
        await axios.delete(`/api/programs/${id}`)
        goBack()
    }



    return (
        <Layout>
            <h2>Program Deletion Confirmation</h2>
            <h4>Proceed to delete the following program? </h4>
            <h2> {program?.programName} </h2>
            <div className="flex gap-5">
                <button
                    className="btn-danger"
                    onClick={confirmDelete}
                >
                    Yes
                </button>

                <button
                    className="btn-primary"
                    onClick={goBack}
                >
                    No
                </button>
            </div>
        </Layout>
    )
}
