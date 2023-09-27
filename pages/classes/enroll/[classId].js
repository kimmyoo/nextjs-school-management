import Layout from "@/components/Layout"
import { useState, useEffect } from "react";
import { Class } from "@/models/class";
import mongooseConnect from "@/lib/mongoose";
import axios from "axios";
import { useRouter } from "next/router";
import StudentForm from "@/components/StudentForm";


export default function EnrollStudent({ cls }) {
  const [searchResult, setSearchResult] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)

  return (
    <Layout>
      <h2>Enrollment to {cls.classCode.toUpperCase()}</h2>
      <div className="flex formCols-container">
        <div>Quick Search</div>
        <div>Search Result</div>
      </div>
      <div className="inline-flex items-center justify-center w-full">
        <hr className="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
        <span className="absolute p-2 font-medium text-xl bg-slate-200 ">or</span>
      </div>

      {/* conditionally render components based on search result and chosen student */}
      {
        selectedStudent
          ? <div>New Component goes here where it takes cls and selected student. associate both doc from api request</div>
          : <StudentForm cls={cls} />
      }

    </Layout>
  )
}


export async function getServerSideProps(context) {
  const { classId } = context.query
  mongooseConnect()
  const cls = await Class.findOne({ _id: classId }, null).populate('program').populate('license')

  return {
    props: {
      cls: JSON.parse(JSON.stringify(cls)),
    }
  }
}
