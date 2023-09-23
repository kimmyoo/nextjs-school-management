import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import Link from "next/link"
import { isInstructorFormValid } from "@/lib/validation"

export default function InstructorForm({ instructor }) {
    const [name, setName] = useState(instructor?.instructorName || '')
    const [phoneNum, setPhoneNum] = useState(instructor?.instructorPhoneNum || '')
    const [email, setEmail] = useState(instructor?.instructorEmail || '')
    const [formErrors, setFormErrors] = useState({})
    const [redirect, setRedirect] = useState(false)

    const router = useRouter()
    const _id = instructor?._id


    async function handleSubmit(e) {
        e.preventDefault();
        const formData = {
            name, phoneNum, email
        }
        if (!isInstructorFormValid(formData, setFormErrors)) {
            return
        }

        if (_id) {
            try {
                await axios.patch(`/api/instructors/${_id}`, { ...formData, _id })
            }
            catch (err) {
                console.log('form submission error:', err)
            }
        } else {
            try {
                const response = await axios.post('/api/instructors/', formData)
                console.log(response.data)
            } catch (err) {
                console.error('form submission error:', err)
            };
        }
        setRedirect(true)
    }


    if (redirect) {
        router.push('/instructors')
    }


    return (
        <>
            <form className="flex flex-col">
                <div className="flex">
                    <label>Instructor Name</label>
                    {formErrors.name && <span className="formError">{formErrors.name}</span>}
                </div>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <div className="flex">
                    <label>Phone Number</label>
                </div>
                <input
                    type="text"
                    name="phoneNum"
                    value={phoneNum}
                    onChange={e => setPhoneNum(e.target.value)}
                />

                <div className="flex">
                    <label>Email</label>
                </div>
                <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

            </form>
            <div className="flex justify-between">
                <button
                    className="btn-primary"
                    onClick={handleSubmit}
                >
                    Save Instructor
                </button>

                {
                    _id && <Link href={`/instructors/delete/${_id}`}>
                        <button
                            className="btn-warn"
                        >
                            Delete
                        </button>
                    </Link>
                }
            </div>
        </>
    )
}
