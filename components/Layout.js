import Nav from "@/components/Nav"

export default function Layout({ children }) {
    return (
        // flex on outer div will put nav and div side by side
        <div className="bg-slate-300 min-h-screen flex">
            <Nav />
            <div className="bg-slate-200 flex-grow p-2 mt-3 mb-2">
                {children}
            </div>
        </div>
    )

}
