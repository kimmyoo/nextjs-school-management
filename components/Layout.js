import Nav from "@/components/Nav"
import { useState } from "react"

export default function Layout({ children }) {
    const [showNav, setShowNav] = useState(false)

    return (
        <div className="bg-slate-300 min-h-screen">
            <div className="md:hidden flex items-center justify-center p-2">
                <button
                    onClick={() => setShowNav(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                    </svg>
                </button>
                <h4>Occupational School Management</h4>
            </div>
            <div className="flex">
                <Nav showNav={showNav} />
                {/* must specifiy w-screen for overflow-auto to work */}
                <div className="bg-slate-200 flex-grow p-2 mt-3 mb-2 w-screen">
                    {children}
                </div>
            </div>
        </div>
    )
}
