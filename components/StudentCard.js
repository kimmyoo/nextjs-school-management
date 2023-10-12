import Link from "next/link"
import format from "date-fns/format"

export default function StudentCard({ student }) {

  return (
    <div className="rounded-md overflow-hidden w-auto shadow-lg">
      <div className="px-6 py-2">
        <div className="font-normal text-xl text-center mb-4 flex gap-3 justify-center">
          {student.lastName}, {student.firstName}
          <Link href={`/students/edit/${student._id}`}>
            <small className="bg-blue-200 rounded-md px-2">Edit</small>
          </Link>
        </div>
        <div className="formCols-container">
          <div className="col-in-form">Unique ID</div>
          <div className="col-in-form">{student.uniqueId}</div>

          <div className="col-in-form">Last Name</div>
          <div className="col-in-form">{student.lastName}</div>

          <div className="col-in-form">First Name</div>
          <div className="col-in-form">{student.firstName}</div>

          <div className="col-in-form">Gender</div>
          <div className="col-in-form">{student.gender}</div>

          <div className="col-in-form">DOB</div>
          <div className="col-in-form">{format(new Date(student.dob), 'yyyy-MM-dd')}</div>

          <div className="col-in-form">Phone Number</div>
          <div className="col-in-form">{student.phoneNum || "N/A"}</div>

          <div className="col-in-form">Last4Digits</div>
          <div className="col-in-form">{student.last4Digits}</div>

          <div className="col-in-form">Email</div>
          <div className="col-in-form">{student.email || "N/A"}</div>

          <div className="col-in-form">Address</div>
          <div className="col-in-form">{student.address || "None"}</div>

          <div className="col-in-form">Note</div>
          <div className="col-in-form">{student.sideNote || "None"}</div>

          <div className="col-in-form">Registration Date</div>
          <div className="col-in-form">{format(new Date(student.createdAt), 'yyyy-MM-dd')}</div>

          <div className="col-in-form">Updated At</div>
          <div className="col-in-form">{format(new Date(student.updatedAt), 'yyyy-MM-dd,  hh:mm aaaa')}</div>

          <div className="col-in-form">Classes Enrolled</div>
          <div className="col-in-form">
            <div className="flex gap-1">
              {student.classes.length > 0
                ? student.classes.map(cls => (
                  <Link
                    key={cls._id}
                    href={`/classes/${cls._id}`}
                    className="nooutline-link"
                  >
                    {cls.classCode}
                  </Link>
                ))
                : "N/A"
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
