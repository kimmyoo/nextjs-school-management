import Layout from "@/components/Layout"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "axios"
import { isValidObjectId } from "@/lib/validation"
import InstructorForm from "@/components/InstructorForm"

export default function EditInstructor() {

    const router = useRouter()
    const { id } = router.query
    const [instructor, setInstructor] = useState(null)

    useEffect(() => {
        // checking router's readiness
        // once router is ready then load data using id
        // to avoid invalid ObjectId error caused by sending undefined ObjectId to api
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

    if (!id || !isValidObjectId(id)) {
        return <Layout>
            <h2>Something wrong, Invalid instructor Id</h2>
        </Layout>
    }

    return (
        <Layout>
            <h2>Edit instructor, {instructor?.instructorName}</h2>
            {instructor && <InstructorForm instructor={instructor} />}
        </Layout>
    )
}
