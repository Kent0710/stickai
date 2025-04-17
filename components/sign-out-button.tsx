'use client'

import { signOut } from "next-auth/react"
import { Button } from "./ui/button"

const SignOutButton = () => {
    return (
        <Button onClick={()=>signOut({callbackUrl : 'http://localhost:3000/signIn'})}>
            Sign out 
        </Button>
    )
};

export default SignOutButton;