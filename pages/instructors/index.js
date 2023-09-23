import Layout from "@/components/Layout"
import Link from "next/link"
import { useState, useEffect } from "react"
import axios from "axios"
import InstructorCard from "@/components/InstructorCard"
import { Instructor } from "@/models/instructor"
import mongooseConnect from "@/lib/mongoose"

//instructors
export default function InstructorsPage({ instructors }) {
    // const [instructors, setInstructors] = useState([])

    // useEffect(() => {
    //     axios.get('/api/instructors/')
    //         .then(response => {
    //             setInstructors(response.data)
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         })
    // }, [])

    let contentToDisplay

    if (instructors.length > 0) {
        contentToDisplay = <div className="cards-container">
            {instructors?.map(instructor => (
                <InstructorCard instructor={instructor} key={instructor._id} />
            ))}
        </div>
    } else {
        contentToDisplay = <div className="cards-container">
            <p>no instructor added yet.</p>
        </div>
    }

    return (
        <Layout>
            <div>
                <div className="flex justify-between">
                    <h2>Instructors Page</h2>
                    <div className="mt-2">
                        <Link
                            href={'/instructors/new'}
                            className="new-link"                        >
                            Add Instructor
                        </Link>
                    </div>
                </div>
            </div>
            {contentToDisplay}
        </Layout>
    )
}


export async function getServerSideProps() {
    await mongooseConnect()

    const instructors = await Instructor.find({}, null, {
        sort: {
            "instructorName": 1,
        }
    }).populate('licenses')

    return {
        props: {
            instructors: JSON.parse(JSON.stringify(instructors)),
        }
    }

}
