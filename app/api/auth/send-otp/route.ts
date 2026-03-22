import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try {
    // const { rateLimited } = await checkRateLimit(request)
    // if(rateLimited){
    //      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    // }
    const {email}= await request.json();
    // find email in db if already exist give error and do not generate otp
    // if(){
        
    // }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    console.log("otp:",otp);
    return Response.json({success:true});
        
    } catch (error) {
        console.log(error);
        const message="Error while generating OTP!"
        return new NextResponse(message, { status: 500 })
    }
    

}