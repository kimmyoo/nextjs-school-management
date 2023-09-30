import { useSession, signIn } from "next-auth/react"
import Nav from "@/components/Nav"
import Header from "@/components/Header"

export default function Layout({ children }) {
    // grab the session by using useSession from next-auth
    // page protection
    const { data: session, status } = useSession()
    // console.log(status)
    if (!status || !session) {
        return (<>
            <Header />
            <div className="bg-slate-300 w-screen h-screen flex items-center">
                <div className="text-center w-full">
                    <button
                        className="bg-white p-2 rounded-md"
                        onClick={() => signIn('google')}
                    >Log In with Google Account</button>
                </div>
            </div>
        </>)
    }

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
