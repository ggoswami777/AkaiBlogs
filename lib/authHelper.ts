import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
export interface AuthenticatedUser{
    userId:string;
    username:string;
}

export function getAuthUser(request:NextRequest):AuthenticatedUser{
    const token=request.cookies.get("token")?.value;
    if(!token){
        throw new Error("Unauthorized:No token provided");
    }
    try {
        const decoded=jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as AuthenticatedUser;
        return decoded;
    } catch (error) {
         throw new Error("Unauthorized: Invalid token session");
    }
}