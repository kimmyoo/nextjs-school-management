import ClassCard from "./ClassCard"

export default function ProgramClasses({ classes, program }) {
    return (
        <div className="border bg-slate-300 rounded-lg shadow-lg w-auto">
            <h4 className="text-center mb-6">{program.programName}</h4>
            <div className="flex flex-wrap gap-4 p-1">
                {
                    classes.map(cls => (
                        <ClassCard key={cls._id} cls={cls} />
                    ))
                }
            </div>
        </div>
    )
}
