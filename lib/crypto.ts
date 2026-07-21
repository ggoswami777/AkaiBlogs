const ECDH_PARAMS:EcKeyGenParams={name:"ECDH",namedCurve:"P-256"};
const AES_PARAMS:AesKeyGenParams={name:"AES-GCM",length:256};
const IV_LENGTH=12;

function base64ToArrayBuffer(base64:string):ArrayBuffer{
    const binary=atob(base64);
    const bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
    return bytes.buffer;
}

function arrayBufferToBase64(buffer:ArrayBuffer):string{
    const bytes=new Uint8Array(buffer);
    let binary="";
    for(let i=0;i<bytes.length;i++) binary+=String.fromCharCode(bytes[i]);
    return btoa(binary);
}

export async function generateUserKeyPair():Promise<CryptoKeyPair> {
    return crypto.subtle.generateKey(ECDH_PARAMS,false,["deriveKey","deriveBits"]);
}

export async function exportPublicKey(key:CryptoKey):Promise<string>{
    const exported=await crypto.subtle.exportKey("spki",key);
    return arrayBufferToBase64(exported); 
}

export async function importPublicKey(base64Key:string):Promise<CryptoKey> {
    const buffer=base64ToArrayBuffer(base64Key);
    return crypto.subtle.importKey("spki",buffer,ECDH_PARAMS,true,[]);
}

export async function deriveSharedKey(myPrivateKey:CryptoKey,peerPublicKey:CryptoKey):Promise<CryptoKey>{
    return crypto.subtle.deriveKey(
        {name:"ECDH",public:peerPublicKey},
        myPrivateKey,
        AES_PARAMS,
        false,
        ["encrypt","decrypt"]
    );
}

export async function encryptMessage(text:string,sharedKey:CryptoKey):Promise<{ciphertext:string,iv:string}> {
    const iv=crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encoded=new TextEncoder().encode(text);
    const encrypted=await crypto.subtle.encrypt({name:"AES-GCM",iv},sharedKey,encoded);
    return {
        ciphertext:arrayBufferToBase64(encrypted),
        iv:arrayBufferToBase64(iv.buffer),
    }
}

export async function decryptMessage(
  ciphertextBase64: string,
  ivBase64: string,
  sharedKey: CryptoKey
): Promise<string> {
  const ciphertext = base64ToArrayBuffer(ciphertextBase64);
  const iv = base64ToArrayBuffer(ivBase64);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, sharedKey, ciphertext);
  return new TextDecoder().decode(decrypted);
}