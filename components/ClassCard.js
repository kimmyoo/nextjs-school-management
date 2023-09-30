import Link from "next/link"


export default function ClassCard({ cls }) {
    const closed = "rounded-md outline px-1 py-1 text-center font-normal text-slate-600 hover:bg-white"
    const open = "rounded-md outline px-1 py-1 font-normal text-center text-green-700 hover:bg-white"
    return (
        <Link href={`/classes/${cls._id}`}>
            <div className={cls.status ? open : closed} >
                {cls.classCode.toUpperCase()}
            </div >
        </Link>

    )
}
