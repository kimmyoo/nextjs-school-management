import { useRouter } from "next/router"
import Layout from "@/components/Layout"
import { useEffect, useState } from "react"
import axios from "axios"

export default function DeleteInstructor() {
    const router = useRouter()
    const { id } = router.query
    const [instructor, setInstructor] = useState(null)


    useEffect(() => {
        if (router.isReady) {
            axios.get(`/api/instructors/${id}`)
                .then(response => {
                    setInstructor(response.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [id, router.isReady])

    const goBack = () => {
        router.push('/instructors/')
    }

    const confirmDelete = async () => {
        await axios.delete(`/api/instructors/${id}`)
        goBack()
    }

    return (
        <Layout>
            <h2>Instructor Deletion Confirmation</h2>
            <h4>Proceed to delete the following instructor? </h4>
            <h2> {instructor?.instructorName} </h2>
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
