import Link from "next/link"


export default function ClassCard({ cls }) {
    const closed = "rounded-md px-1 py-1 text-center font-normal bg-slate-400"
    const open = "rounded-md px-1 py-1 text-center font-normal bg-green-500"
    return (
        <Link href={`/classes/${cls._id}`}>
            <div className={cls.status ? open : closed} >
                {cls.classCode.toUpperCase()}
            </div >
        </Link>

    )
}
