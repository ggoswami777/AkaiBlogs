"use client";

import { io, Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/chat";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket(){
    if(!socket){
        socket=io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000",{
            withCredentials:true,
            transports:["websocket"],
        }) 
    }
    return socket;
}

export function disconnectSocket(){
    if(socket){
        socket.disconnect();
        socket=null;
    }
}