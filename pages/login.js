import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"


export default function Login() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        // Always do navigations after the first render
        router.push('/', undefined, { shallow: true })
    }, [router])


    if (!status || !session) {
        return (
            <div className="h-screen w-screen">
                <Header />
                <div className="bg-slate-200 h-5/6 flex">
                    <div className="text-center w-full mt-20 flex-col">
                        <h4>Admin User Login</h4>
                        <h4>Authorized Personnel Only</h4>
                        <button
                            className="bg-white p-2 rounded-md"
                            onClick={() => signIn('google')}
                        >Log In with Google Account</button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    //  this way will cause  Loading initial props cancelled error
    //  use useEffect()
    // if (status && session) {
    //     if (router.isReady) {
    //         router.push('/')
    //     }
    // }
}
