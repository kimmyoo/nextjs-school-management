import Link from "next/link"

export default function ProgramCard({ program }) {

    const active = "inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-green-500 mr-2 mb-2"
    const inactive = "inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-red-500 mr-2 mb-2"
    const info = "inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"

    return (
        <div className="bg-white max-w-sm rounded-md overflow-hidden shadow-lg">
            <div className="px-6 py-2">
                <div className="font-bold text-xl mb-2">{program.programName}</div>
                <p>
                    Curriculum Code: {program.programCode}
                </p>
                <p>
                    Approved Since: {program.effectiveOn}
                </p>
                <p>
                    Expires On: {program.expiresOn}
                </p>
            </div>
            <div className="px-6 pt-1 pb-2">
                <span className={info}>${program.programCost}</span>
                <span className={info}>{program.programLength}hrs</span>
                <span className={program.isActive ? active : inactive}>{program.isActive ? "active" : "inactive"}</span>
                <Link
                    href={'/programs/edit/' + program._id}
                >
                    <span
                        className="edit-link"
                    >
                        Edit
                    </span>
                </Link>
            </div>
        </div>
    )
}
