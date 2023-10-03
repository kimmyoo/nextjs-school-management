import Layout from "@/components/Layout"
import { Class } from "@/models/class"
import { Program } from "@/models/program"
import mongooseConnect from "@/lib/mongoose"
import ProgramClasses from "@/components/ProgramClasses"
import ClassCard from "@/components/ClassCard"
import { getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import axios from "axios"


export default function ClassesPage({ preFetchedGroupedClasses, programs }) {
    const [classGroups, setClassGroups] = useState(preFetchedGroupedClasses)
    const [selectedOption, setSelectedOption] = useState('')

    const [searchQuery, setSearchQuery] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [isSelectDisabled, setIsSelectDisabled] = useState(false)

    useEffect(() => {
        const searchStudent = async () => {
            axios.post(`/api/classes/search?q=${searchQuery}`)
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
            setIsSelectDisabled(true)
        } else {
            setSearchQuery('')
            setSearchResult([])
            setIsSelectDisabled(false)
        }
    }

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value)
        if (e.target.value) {
            const selectedClassGroup = preFetchedGroupedClasses.filter(group => group.programId === e.target.value)
            setClassGroups(selectedClassGroup)
        } else {
            setClassGroups(preFetchedGroupedClasses)
        }
    }

    return (
        <Layout>
            <div className="flex justify-between">
                <h2>Recent Classes</h2>
                <div className="flex gap-2 p-1 pr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="class code"
                        onChange={handleSearchQueryChange}
                    />
                    <select
                        className={selectedOption ? "bg-yellow-300" : ""}
                        value={selectedOption}
                        onChange={handleSelectChange}
                        disabled={isSelectDisabled}
                    >
                        <option value="">All Programs</option>
                        {programs.map(program => (
                            <option
                                key={program._id}
                                value={program._id}>
                                {program.programName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {
                (searchResult && !searchQuery) && <div>
                    <small>most recent 20 classes in each program</small>
                    <div className="mb-3 flex flex-col gap-6">
                        {classGroups.map(group => {
                            const program = programs.find(prog => prog._id === group.programId)
                            return <ProgramClasses
                                key={group.programId}
                                program={program}
                                classes={group.classes}
                            />
                        })}
                    </div>
                </div>
            }

            {
                searchResult.length > 0 && <dir>
                    <p className="mb-2">Search Result: {searchResult.length} </p>
                    <div className="flex gap-4">
                        {searchResult.map(cls => (
                            <ClassCard key={cls._id} cls={cls} />
                        ))}
                    </div>
                </dir>
            }

            {
                (searchQuery && searchResult.length === 0) && <p>
                    Search Result: 0 class found.
                </p>
            }

        </Layout >
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
    const pipeline = [
        {
            $sort: { "end": -1 } // Sort the documents by end date descending order
        },
        {
            $group: {
                "_id": "$program",
                classes: { $push: '$$ROOT' },
                count: { $sum: 1 } // Count the number of documents in each group
            },
        },
        {
            $project: {
                _id: 0, // Exclude the _id field
                programId: '$_id', // Rename _id to program
                // classes: 1 // Keep the classes
                classes: { $slice: ['$classes', 10] },
                count: 1
            }
        }
    ]

    const programs = await Program.find()
    const groupedClasses = await Class.aggregate(pipeline).sort('programId')
    return {
        props: {
            preFetchedGroupedClasses: JSON.parse(JSON.stringify(groupedClasses)),
            programs: JSON.parse(JSON.stringify(programs))
        }
    }
}