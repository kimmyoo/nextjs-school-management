import Link from "next/link"

export default function InstructorCard({ instructor }) {

    return (
        <div className="bg-stone-300 max-w-sm rounded-md overflow-hidden shadow-lg">
            <div className="px-6 py-2">
                <div className="font-bold text-xl mb-2">{instructor.instructorName}</div>
                <p>
                    Phone Number: {instructor.instructorPhoneNum}
                </p>
                <p>
                    Email: {instructor.instructorEmail}
                </p>
            </div>
            <div className="px-6 pt-1 pb-2">
                <Link
                    href={'/instructors/edit/' + instructor._id}
                >
                    <span
                        className="edit-link"
                    >
                        Edit
                    </span>
                </Link>

                <Link
                    href={`/instructors/${instructor._id}`}
                >
                    <span
                        className="primary-link"
                    >
                        Licenses
                    </span>
                </Link>
            </div>
        </div>
    )
}

