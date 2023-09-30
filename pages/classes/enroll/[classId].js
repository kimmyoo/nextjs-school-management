import Layout from "@/components/Layout"
import { useState, useEffect } from "react";
import { Class } from "@/models/class";
import mongooseConnect from "@/lib/mongoose";
import axios from "axios";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import StudentForm from "@/components/StudentForm";
import StudentCard from "@/components/StudentCard";


export default function EnrollStudent({ cls }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [redirect, setRedirect] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const searchStudent = async () => {
      axios.post(`/api/students/search?q=${searchQuery}`)
        .then(response => {
          setSearchResult(response.data)
        })
        .catch(err => {
          console.error(err.message)
        })
    }

    const debouncedSearch = setTimeout(() => {
      if (searchQuery) {
        searchStudent()
      } else {
        setSearchResult([])
      }
    }, 500)

    return () => clearTimeout(debouncedSearch)
  }, [searchQuery])

  const changeVisibility = (isVisible) => {
    setIsVisible(isVisible)
  }

  const selectStudent = (e) => {
    const { value } = e.target
    const matched = searchResult.find(student => student._id === value)
    setSelectedStudent(matched)
  }

  const handleSearchQueryChange = (e) => {
    const { value } = e.target
    if (value) {
      setSearchQuery(value)
    } else {
      setSearchQuery('')
      setSearchResult([])
      setSelectedStudent(null)
      setError(null)
    }
  }

  const handleEnroll = async (e) => {
    e.preventDefault()

    try {
      await axios.patch("/api/classes/enroll/", { cls, selectedStudent })
      setRedirect(true)
    } catch (err) {
      setError(err.response.data)
      console.error('form submission error:', err.response.data)
    }
  }


  if (redirect) {
    router.push(`/classes/${cls._id}`)
  }


  return (
    <Layout>
      <h2>Enrollment to class: {cls.classCode.toUpperCase()}</h2>
      {
        isVisible && <div>
          <h4>Enroll a previously registered student</h4>
          <div className="flex formCols-container">
            <div className="col-in-form">
              <label htmlFor="">Search Registered Student<small>(type last or first name, unique Id# or ssn)</small></label>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchQueryChange}
              />
              <div>
                <p>Search Result: </p>
                <div className="flex flex-col gap-2">
                  {
                    searchResult.length > 0 && searchResult.map(student => (
                      <button
                        type="button"
                        key={student._id}
                        value={student._id}
                        className={selectedStudent?._id === student._id ? "btn-warn" : "btn-primary"}
                        onClick={selectStudent}
                      >
                        {student.lastName}, {student.firstName} - {student.uniqueId}
                      </button>
                    ))
                  }
                </div>
              </div>
            </div>
            {/* student card for preview */}
            <div>
              {selectedStudent && searchResult.length > 0
                ? <StudentCard student={selectedStudent} />
                : <p>Student Preview</p>
              }
            </div>
          </div>
        </div>
      }

      {/* conditionally render components based on search result and chosen student */}
      {
        selectedStudent || searchResult.length > 0
          ? <div>
            {selectedStudent &&
              <button
                className="btn-warn"
                type="button"
                onClick={handleEnroll}
              >
                Enroll Student
              </button>}
            {
              error && <p className="err-msg">Error: {selectedStudent?.firstName} {selectedStudent?.lastName}-{error.message}</p>
            }
          </div>
          : <div>
            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
              <span className="absolute p-2 font-medium text-xl bg-slate-200 ">or</span>
            </div>
            <StudentForm cls={cls} changeVisibility={changeVisibility} />
          </div>
      }
    </Layout>
  )
}


export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const { classId } = context.query
  mongooseConnect()
  const cls = await Class.findOne({ _id: classId }, null).populate('program').populate('license')

  return {
    props: {
      cls: JSON.parse(JSON.stringify(cls)),
    }
  }
}
