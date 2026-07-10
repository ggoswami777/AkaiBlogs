import { parseCookie } from "cookie";
import * as jwt from "jsonwebtoken";


export type SocketUser={
    userId:string;
    username:string;
}
export function getSocketUser(cookieHeader?:string):SocketUser | null{
    if(!cookieHeader) return null;
    const cookies=parseCookie(cookieHeader);
    const token=cookies.token;
    if(!token){
        return null;
    }
    try{
        return jwt.verify(token,process.env.JWT_SECRET as string) as SocketUser
    }
    catch{
        return null;
    }
}