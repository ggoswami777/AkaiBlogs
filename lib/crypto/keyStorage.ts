import { get, set, del } from "idb-keyval";

export async function storePrivateKey(userId:string,privateKey:CryptoKey):Promise<void>{
    await set(`e2ee_pk_${userId}`,privateKey);
}

export async function getPrivateKey(userId:string):Promise<CryptoKey | undefined> {
    return get<CryptoKey>(`e2ee_pk_${userId}`);
}

export async function clearPrivateKey(userId:string):Promise<void>{
    await del(`e2ee_pk_${userId}`);
}