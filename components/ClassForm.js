// form component shared by EditClass and NewClass components
import { useState } from "react"
import { isClassFormValid } from "@/lib/validation"
import axios from "axios"
import { useRouter } from "next/router"

export default function ClassForm({ licensesOfSameProgram, license, cls }) {
  const classId = cls?._id

  const [selectedLic, setSelectedLic] = useState(license._id)
  const [classCode, setClassCode] = useState(cls?.classCode || '')
  const [schedule, setSchedule] = useState(cls?.schedule || '')
  const [begin, setBegin] = useState(cls?.begin.split("T")[0] || '')
  const [end, setEnd] = useState(cls?.end.split("T")[0] || '')
  const [intshpBegin, setIntshpBegin] = useState(cls?.intshpBegin?.split("T")[0] || '')
  const [intshpEnd, setIntshpEnd] = useState(cls?.intshpEnd?.split("T")[0] || '')
  const [sideNote, setSideNote] = useState(cls?.sideNote || '')
  const [status, setStatus] = useState(cls?.status)
  const [formErrors, setFormErrors] = useState({})
  const [redirect, setRedirect] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = {
      program: license.program._id,
      license: selectedLic,
      classCode,
      schedule,
      begin, end,
      intshpBegin,
      intshpEnd,
      sideNote: sideNote === "" ? null : sideNote,
    }

    if (!isClassFormValid(formData, setFormErrors)) {
      return
    }

    if (classId) {
      axios.patch(`/api/classes/${classId}`, { ...formData, status, _id: classId })
        .then(response => {
          console.log(response)
          setRedirect(true)
        })
        .catch(err => {
          setError(err.response.data)
          console.error('form submission error: ', err.response.data)
        })
    } else {
      axios.post('/api/classes', formData)
        .then(response => {
          console.log(response.data)
          setRedirect(true)
        })
        .catch(err => {
          setError(err.response.data)
          console.error('form submission error:', err.response.data)
        })
    }
  }


  const onRadioInputChange = (e) => {
    const val = e.target.value
    setStatus(val === "true" ? true : false)
  }


  if (redirect && classId) {
    router.push(`/classes/${classId}?refresh=true`)
  }
  if (redirect) {
    router.push('/classes/')
  }

  return (
    <div>
      {classId ? <h2>Edit Class {classCode}</h2> : <h2>Schedule a Class</h2>}

      <form className="flex flex-col">
        <div className="formCols-container">
          <div className="col-in-form">
            <p>Program</p>
            <p>{license.program.programName}</p>
          </div>
          <div className="col-in-form">
            <div className="flex">
              <label htmlFor="selectedLic">Teacher-License</label>
              {formErrors.license && <span className="formError">{formErrors.license}</span>}
            </div>
            <select
              name="selectedLic"
              id="selectedLic"
              value={selectedLic}
              onChange={e => setSelectedLic(e.target.value)}
            >
              <option value="">Select License</option>
              {licensesOfSameProgram.map(lic => (
                <option
                  value={lic._id}
                  key={lic._id}
                >
                  {lic.instructor.instructorName}-{lic.licenseNum}
                </option>
              ))}
            </select>
          </div>
          <div className="col-in-form">
            <div className="flex">
              <label htmlFor="classCode">Class code:</label>
              {formErrors.classCode && <span className="formError">{formErrors.classCode}</span>}
            </div>
            <input
              id="classCode"
              type="text"
              value={classCode}
              onChange={e => setClassCode(e.target.value)}
            />
          </div>
          <div className="col-in-form">
            <div className="flex">
              <label htmlFor="schedule">Schedule</label>
              {formErrors.schedule && <span className="formError">{formErrors.schedule}</span>}
            </div>
            <select
              name="schedule"
              id="schedule"
              value={schedule}
              onChange={e => setSchedule(e.target.value)}
            >
              <option value="">Select schedule</option>
              <optgroup label="Daytime">
                <option value="d-m-f">Day-Mon-Fri</option>
                <option value="d-wknd">Day-Sat & Sun</option>
                <option value="d-sat">Day-Sat</option>
                <option value="d-sun">Day-Sun</option>
              </optgroup>
              <optgroup label="Evening">
                <option value="e-m-f">Eve-Mon-Fri</option>
                <option value="e-wknd">Eve-Sat & Sun</option>
                <option value="e-sat">Eve-Sat</option>
                <option value="e-sun">Eve-Sun</option>
              </optgroup>
            </select>
          </div>
          <div className="col-in-form">
            <div className="flex">
              <label htmlFor="begin">Class Begins</label>
              {formErrors.begin && <span className="formError">{formErrors.begin}</span>}
            </div>
            <input
              id="begin"
              type="date"
              value={begin}
              onChange={e => setBegin(e.target.value)}
            />
          </div>
          <div className="col-in-form">
            <div className="flex">
              <label htmlFor="end">Class Ends</label>
              {formErrors.end && <span className="formError">{formErrors.end}</span>}
            </div>
            <input
              id="end"
              type="date"
              value={end}
              onChange={e => setEnd(e.target.value)}
            />
          </div>

          <div className="col-in-form">
            <label htmlFor="intshpBegin">Intshp Begins</label>
            <input
              id="intshpBegin"
              type="date"
              value={intshpBegin}
              onChange={e => setIntshpBegin(e.target.value)}
            />
          </div>
          <div className="col-in-form">
            <label htmlFor="intshpEnd">Intshp Ends</label>
            <input
              id="intshpEnd"
              type="date"
              value={intshpEnd}
              onChange={e => setIntshpEnd(e.target.value)}
            />
          </div>
        </div>

        <label htmlFor="sidenote">Side Note</label>
        <textarea
          id="sidenote"
          cols="30"
          rows="5"
          value={sideNote}
          onChange={e => setSideNote(e.target.value)}
        ></textarea>

        {cls?._id && <div className="p-2">
          <input
            name="status"
            id="open"
            type="radio"
            value="true"
            checked={status === true}
            onChange={onRadioInputChange}
          />
          <label htmlFor="open">Open</label>
          <input
            name="status"
            id="closed"
            type="radio"
            value="false"
            checked={status === false}
            onChange={onRadioInputChange}
          />
          <label htmlFor="closed">Closed</label>
        </div>}
      </form>
      {error && <p className="err-msg">Error: {error.message}</p>}

      <div className="flex justify-between">
        <button
          className="btn-primary"
          onClick={handleSubmit}
        >
          Save Class
        </button>

        {/* {
                    _id && <Link href={`/programs/delete/${_id}`}>
                        <button
                            className="btn-warn"
                        >
                            Delete
                        </button>
                    </Link>
                } */}
      </div>
    </div>
  )
}

