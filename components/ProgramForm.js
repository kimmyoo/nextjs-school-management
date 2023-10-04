import { useState } from "react"
import { isProgramFormValid } from "@/lib/validation"
import axios from "axios"
import { useRouter } from "next/router"
import Link from "next/link"

export default function ProgramForm({ program }) {

    const [name, setName] = useState(program?.programName || '')
    const [code, setCode] = useState(program?.programCode || '')
    const [length, setLength] = useState(program?.programLength || '')
    const [cost, setCost] = useState(program?.programCost || '')
    const [effectiveOn, setEffectiveOn] = useState(program?.expiresOn || '')
    const [expiresOn, setExpiresOn] = useState(program?.effectiveOn || '')
    const [isActive, setIsActive] = useState(program?.isActive)

    const [formErrors, setFormErrors] = useState({})
    const [redirect, setRedirect] = useState(false)

    const _id = program?._id

    const router = useRouter()


    const onRadioInputChange = (e) => {
        const val = e.target.value
        setIsActive(val === "true" ? true : false)
    }


    async function handleSubmit(e) {
        e.preventDefault();
        const formData = {
            name, code, length, cost, effectiveOn, expiresOn
        }

        if (!isProgramFormValid(formData, setFormErrors)) {
            return
        }

        // let errorDetails = [] // for holding backend errors
        if (_id) {
            try {
                await axios.put(`/api/programs/${_id}`, { ...formData, _id, isActive })
            }
            catch (err) {
                console.log('form submission error:', err.response)
            }
        } else {
            try {
                const response = await axios.post('/api/programs/', formData)
                console.log(response.data)
            } catch (err) {
                console.error('form submission error:', err.response.data)
            };
        }
        setRedirect(true)
    }


    if (redirect) {
        router.push('/programs')
    }


    return (
        <>
            <form className="flex flex-col">
                <div className="flex">
                    <label htmlFor="name">Program Name</label>
                    {formErrors.name && <span className="formError">{formErrors.name}</span>}
                </div>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <div className="flex">
                    <label htmlFor="code">Curriculum Code</label>
                    {formErrors.code && <span className="formError">{formErrors.code}</span>}
                </div>
                <input
                    id="code"
                    type="text"
                    name="code"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                />

                <div className="flex">
                    <label htmlFor="length">Contact Hours</label>
                    {formErrors.length && <span className="formError">{formErrors.length}</span>}
                </div>
                <input
                    id="length"
                    type="text"
                    name="length"
                    value={length}
                    onChange={e => setLength(e.target.value)}
                />

                <div className="flex">
                    <label htmlFor="cost">Cost</label>
                    {formErrors.cost && <span className="formError">{formErrors.cost}</span>}
                </div>
                <input
                    id="cost"
                    type="text"
                    name="cost"
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                />

                <div className="flex">
                    <label htmlFor="effectiveOn">Effective on</label>
                    {formErrors.effectiveOn && <span className="formError">{formErrors.effectiveOn}</span>}
                </div>
                <input
                    id="effectiveOn"
                    type="date"
                    name="effectiveOn"
                    value={effectiveOn}
                    onChange={e => setEffectiveOn(e.target.value)}
                />

                <div className="flex">
                    <label htmlFor="expiresOn">Expires on</label>
                    {formErrors.expiresOn && <span className="formError">{formErrors.expiresOn}</span>}
                </div>
                <input
                    id="expiresOn"
                    type="date"
                    name="expiresOn"
                    value={expiresOn}
                    onChange={e => setExpiresOn(e.target.value)}
                />

                {program?._id && <div className="p-2">
                    <input
                        name="isActive"
                        id="active"
                        type="radio"
                        value="true"
                        checked={isActive === true}
                        onChange={onRadioInputChange}
                    />
                    <label htmlFor="active">Active</label>
                    <input
                        name="isActive"
                        id="inactive"
                        type="radio"
                        value="false"
                        checked={isActive === false}
                        onChange={onRadioInputChange}
                    />
                    <label htmlFor="inactive">Inactive</label>
                </div>}
            </form>

            <div className="flex justify-between">
                <button
                    className="btn-primary"
                    onClick={handleSubmit}
                >
                    Save Program
                </button>

                {
                    _id && <Link href={`/programs/delete/${_id}`}>
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
