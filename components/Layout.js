import Nav from "@/components/Nav"

export default function Layout({ children }) {
    return (
        <div className="bg-slate-300 min-h-screen flex">
            <Nav />
            <div className="bg-slate-200 flex-grow p-2 mt-3 mb-2">
                {children}
            </div>
        </div>
    )
}
