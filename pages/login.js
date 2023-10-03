import Header from "@/components/Header"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/router"



export default function Login() {
    const { data: session, status } = useSession()
    const router = useRouter()
    // console.log(status)
    if (!status || !session) {
        return (<>
            <Header />
            <div className="bg-slate-300 w-screen h-screen flex items-center">
                <div className="text-center w-full">
                    <h4>School Admin User Login</h4>
                    <button
                        className="bg-white p-2 rounded-md"
                        onClick={() => signIn('google')}
                    >Log In with Google Account</button>
                </div>
            </div>
        </>)
    }

    if (status && session) {
        router.push('/')
    }
}
