import Layout from "@/components/Layout"
import mongooseConnect from "@/lib/mongoose"
import { Student } from "@/models/student"
import StudentCardSmall from "@/components/StudentCardSmall"
import { useState, useEffect } from "react"
import axios from "axios"
import { getSession } from "next-auth/react";

export default function RecentStudents({ students }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResult, setSearchResult] = useState([])
    useEffect(() => {
        const searchStudent = async () => {
            axios.post(`/api/students/search?q=${searchQuery}`)
                .then(response => {
                    setSearchResult(response.data)
                })
                .catch(err => {
                    console.error(err.message)
                })
        }

        const debouncedSearch = setTimeout(() => {
            if (searchQuery && searchQuery.length > 2) {
                searchStudent()
            } else {
                setSearchResult([])
            }
        }, 600)

        return () => clearTimeout(debouncedSearch)
    }, [searchQuery])

    const handleSearchQueryChange = (e) => {
        const { value } = e.target
        if (value) {
            setSearchQuery(value)
        } else {
            setSearchQuery('')
            setSearchResult([])
        }
    }

    let content

    if (students.length === 0) {
        content = <Layout><h4>No recent students</h4></Layout>
    } else {
        content = (
            <Layout>
                <div className="flex justify-between">
                    <h2>Students Page</h2>
                    <div className="flex gap-2 p-1 pr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            id="search"
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            placeholder="Name, uniqueID or ssn"
                        />
                    </div>
                </div>


                {
                    (searchResult.length === 0 && searchQuery.length === 0)
                        ? <div className="flex flex-wrap gap-2">
                            <p className="w-full">Recently updated students</p>
                            {students.map(student => (
                                <StudentCardSmall key={student._id} student={student} />
                            ))}
                        </div>
                        : <div className="flex flex-wrap gap-2">
                            <p className="w-full">Search result</p>
                            {searchResult.map(student => (
                                <StudentCardSmall key={student._id} student={student} />
                            ))}
                        </div>
                }

                {(searchResult.length === 0 && searchQuery.length > 2)
                    && <p>No student found</p>}
            </Layout>
        )
    }

    return (
        content
    )
}


export async function getServerSideProps(context) {
    // server side rendering protection
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
    const students = await Student.find({}, null, {
        sort: {
            "updatedAt": -1,
        }
    }).limit(30)

    return {
        props: {
            students: JSON.parse(JSON.stringify(students))
        }
    }
}