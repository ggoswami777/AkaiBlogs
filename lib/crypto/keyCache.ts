import { deriveSharedKey, importPublicKey } from "./crypto";
import { getPrivateKey } from "./keyStorage";

const sharedKeyCache=new Map<string,CryptoKey>();

export async function getOrDeriveSharedKey(myUserId:string,peerUserId:string,peerBase64PublicKey:string):Promise<CryptoKey> {
    const cached=sharedKeyCache.get(peerUserId);
    if(cached) return cached;

    const myPrivateKey=await getPrivateKey(myUserId);
    if(!myPrivateKey) throw new Error("Missing private key. Please regenerate keys.");
    const peerPublicKey=await importPublicKey(peerBase64PublicKey);
    const sharedKey=await deriveSharedKey(myPrivateKey,peerPublicKey);
    sharedKeyCache.set(peerUserId,sharedKey);
    return sharedKey;
}

export function clearKeyCache():void{
    sharedKeyCache.clear();
}