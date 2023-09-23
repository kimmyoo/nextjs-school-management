import Link from "next/link"



export default function LicenseCard({ license }) {
  return (
    <div className="bg-stone-200 max-w-sm rounded-md overflow-hidden shadow-lg">
      <div className="px-6 py-2">
        <div className="font-bold text-xl mb-2">Lic#: {license.licenseNum}- {license.program.programName}
          <div>

            <Link
              href={`/classes/newClass/${license._id}`}
              className="new-link"
            >
              schedule
            </Link>
            <Link href={`/instructors/editLicense/${license._id}`}>
              <span className="edit-link">Edit</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
