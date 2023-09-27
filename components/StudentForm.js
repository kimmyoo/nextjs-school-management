import { useState, useEffect } from "react";
import { isStudentFormValid, formatPhoneNumber } from "@/lib/validation";
import axios from "axios";
import { useRouter } from "next/router";

export default function StudentForm({ cls }) {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [last4Digits, setLast4Digits] = useState('')
  const [uniqueId, setUniqueId] = useState('')
  const [gender, setGender] = useState('')
  const [phoneNum, setPhoneNum] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [sideNote, setSideNote] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [redirect, setRedirect] = useState(false)
  const router = useRouter()

  // generate stdtId automatically using useEffect()
  useEffect(() => {
    const id = lastName.trim().slice(0, 2) +
      firstName.trim().slice(0, 2) +
      dob.slice(0, 4) +
      last4Digits
    setUniqueId(id.toLowerCase())
  }, [firstName, lastName, last4Digits, dob])

  const [disabled, setDisabled] = useState(true)

  const enableEditInput = () => {
    setDisabled(prev => !prev)
  }



  const handlePhoneNumChange = (e) => {
    const { value } = e.target
    const formattedPhoneNum = formatPhoneNumber(value)
    setPhoneNum(formattedPhoneNum)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = {
      firstName,
      lastName,
      dob,
      last4Digits,
      uniqueId, gender,
      phoneNum, email,
      address, sideNote, classes: [cls._id]
    }


    if (!isStudentFormValid(formData, setFormErrors)) {
      return
    }

    try {
      const response = await axios.post('/api/students/', { formData, classId: cls._id })
      console.log(response.data)
    } catch (err) {
      console.error('form submission error:', err.response.data)
    };
    setRedirect(true)
  }

  if (redirect) {
    router.push(`/classes/${cls._id}`)
  }

  return (
    <>
      <form className="flex flex-col">
        <h4 className="text-green-700">Register a New Student</h4>
        <div className="formCols-container">

          <div className="col-in-form">
            <div className="flex">
              <label htmlFor="firstName">First Name</label>
              {formErrors.firstName && <span className="formError">{formErrors.firstName}</span>}
            </div>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </div>
          <div className="col-in-form">
            <div className="flex">
              <label htmlFor="lastName">Last Name</label>
              {formErrors.lastName && <span className="formError">{formErrors.lastName}</span>}
            </div>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>


          <div className="col-in-form">
            <div className="flex">
              <label htmlFor="dob">DOB</label>
              {formErrors.dob && <span className="formError">{formErrors.dob}</span>}
            </div>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
            />
          </div>
          <div className="col-in-form">
            <div className="flex">
              <label htmlFor="last4Digits">Last 4 digits of SSN</label>
              {formErrors.last4Digits && <span className="formError">{formErrors.last4Digits}</span>}
            </div>
            <input
              id="last4Digits"
              type="text"
              value={last4Digits}
              placeholder="put '0000' if SSN is not available"
              onChange={e => setLast4Digits(e.target.value.slice(0, 4))}
            />
          </div>

          <div className="col-in-form">
            <div className="flex">
              <label htmlFor="gender">Gender</label>
              {formErrors.gender && <span className="formError">{formErrors.gender}</span>}
            </div>
            <select
              name="gender"
              id="gender"
              value={gender}
              onChange={e => setGender(e.target.value)}
            >
              <option value="">select</option>
              <option value="f">Female</option>
              <option value="m">Male</option>
              <option value="u">Unspecified</option>
            </select>
          </div>
          <div className="col-in-form">
            <div className="flex gap-3">
              <div className="flex">
                <label htmlFor="uniqueId">Unique ID:</label>
                <button
                  className="text-yellow-600 bg-slate-100 px-2 rounded-md"
                  onClick={enableEditInput}
                  type="button"
                >
                  edit
                </button>
                {formErrors.uniqueId && <span className="formError">{formErrors.uniqueId}</span>}
              </div>

            </div>
            <input
              id="uniqueId"
              type="text"
              value={uniqueId}
              onChange={e => setUniqueId(e.target.value)}
              disabled={disabled} />
          </div>


          <div className="col-in-form">
            <div className="flex">
              <label htmlFor="email">Email</label>
              {formErrors.email && <span className="formError">{formErrors.email}</span>}
            </div>
            <input
              id="email"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="col-in-form">
            <label htmlFor="phoneNum">Phone Number</label>
            <input
              id="phoneNum"
              type="text"
              value={phoneNum}
              // onChange={e => setPhoneNum(e.target.value)}
              onChange={handlePhoneNumChange}
            />
          </div>


          <div className="col-in-form">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>
          <div className="col-in-form">
            <label htmlFor="sideNote">Note</label>
            <textarea
              id="sideNote"
              type="text"
              value={sideNote}
              onChange={e => setSideNote(e.target.value)}
            />
          </div>
        </div>
      </form>
      <div>
        <button
          type="button"
          className="btn-primary"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </>
  )
}
