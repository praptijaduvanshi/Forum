import Link from "next/link"
import { Icons } from "./Icons"
import { buttonVariants } from "./ui/Button"

const Navbar = () => {

    return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
        <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
            {/* Logo- redirects to homepage using Link component by next.js */}
            <Link href='/' className="flex gap-2 items-center">
                <Icons.logo className="h-12 w-12 sm:h-10 sm:w-10"/>
                <p className="hidden text-zinc 700 text-sm font-medium md:block">Dunkit</p>
            </Link>

            {/*Add a search bar*/}

            {/*Sign-in button for authentication, Link component with classname buttonVariants allows to pass all Button-like properties */}
            <Link href='/sign-in' className={buttonVariants()}>Sign In</Link>

        </div>
    </div>
    )

}

export default Navbar