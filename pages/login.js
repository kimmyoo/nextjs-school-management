import Header from "@/components/Header"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"


export default function Login() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        // Always do navigations after the first render
        router.push('/', undefined, { shallow: true })
    }, [])


    if (!status || !session) {
        return (<>
            <Header />
            <div className="bg-slate-300 w-screen h-screen flex">
                <div className="text-center w-full">
                    <h4>Admin User Login</h4>
                    <button
                        className="bg-white p-2 rounded-md"
                        onClick={() => signIn('google')}
                    >Log In with Google Account</button>
                </div>
            </div>
        </>)
    }

    //  this way will cause  Loading initial props cancelled error
    //  use useEffect()
    // if (status && session) {
    //     if (router.isReady) {
    //         router.push('/')
    //     }
    // }
}
