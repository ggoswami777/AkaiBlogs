import { NextRequest, NextResponse } from "next/server"

export function proxy(request:NextRequest){
    const token=request.cookies.get("token");
    const {pathname}=request.nextUrl;
    if(token && (pathname==="/login" || pathname==="/signup")){
        return NextResponse.redirect(new URL('/akaiBlogs/feed',request.url))
    }
    if(!token && pathname.startsWith('/akaiBlogs')){
        return NextResponse.redirect(new URL('/login',request.url))
    }
    return NextResponse.next()
}
export const config={
    matcher:['/login','/signup','/akaiBlogs/:path',],
}