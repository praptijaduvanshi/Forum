import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

const handler= NextAuth(authOptions)

//Calls this API route with GET or POST request- the handler can accommodate the logic for the request. 
export {handler as GET, handler as POST}