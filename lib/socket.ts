"use client";

import { io, Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/chat";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket(){
    if(!socket){
        const isClient = typeof window !== "undefined";
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || (isClient ? `${window.location.protocol}//${window.location.hostname}:4000` : "http://localhost:4000");
        socket=io(socketUrl,{
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