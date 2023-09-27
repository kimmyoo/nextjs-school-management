import Layout from "@/components/Layout"
import { Class } from "@/models/class"
import { Program } from "@/models/program"
import mongooseConnect from "@/lib/mongoose"
import { useState } from "react"
import ProgramClasses from "@/components/ProgramClasses"


export default function ClassesPage({ preFetchedGroupedClasses, programs }) {
    const [classGroups, setClassGroups] = useState(preFetchedGroupedClasses)
    const [selectedOption, setSelectedOption] = useState('')

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
                <select
                    name=""
                    id=""
                    value={selectedOption}
                    onChange={handleSelectChange}
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

        </Layout>
    )
}



export async function getServerSideProps() {
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
    const groupedClasses = await Class.aggregate(pipeline)
    // console.log(groupedClasses)
    return {
        props: {
            preFetchedGroupedClasses: JSON.parse(JSON.stringify(groupedClasses)),
            programs: JSON.parse(JSON.stringify(programs))
        }
    }
}