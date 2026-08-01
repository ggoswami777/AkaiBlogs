import { describe, it, expect } from "vitest";
import {
  generateUserKeyPair, exportPublicKey, importPublicKey,
  deriveSharedKey, encryptMessage, decryptMessage
} from "@/lib/crypto/crypto";

describe("E2EE crypto",()=>{
    
    it("generates a valid ECDH keypair",async()=>{
        const kp=await generateUserKeyPair();
        expect(kp.publicKey).toBeDefined();
        expect(kp.privateKey).toBeDefined();
    })

    it("exports and reimports a public key",async()=>{
        const kp=await generateUserKeyPair();
        const exported=await exportPublicKey(kp.publicKey);
        expect(typeof exported).toBe("string");
        const imported=await importPublicKey(exported);
        expect(imported).toBeDefined();
    })

    it("two parties derive the same shared key",async()=>{
        const alice=await generateUserKeyPair();
        const bob=await generateUserKeyPair();
        const alicePub=await importPublicKey(await exportPublicKey(alice.publicKey));
        const bobPub=await importPublicKey(await exportPublicKey(bob.publicKey));
        const sharedA=await deriveSharedKey(alice.privateKey,bobPub);
        const sharedB=await deriveSharedKey(bob.privateKey,alicePub);
        const enc=await encryptMessage("hello",sharedA);
        const dec=await decryptMessage(enc.ciphertext,enc.iv,sharedB);
        expect(dec).toBe("hello");
    });

    it("encrypts and decrypts correctly",async()=>{
        const kp=await generateUserKeyPair();
        const peer=await generateUserKeyPair();
        const peerPub=await importPublicKey(await exportPublicKey(peer.publicKey));
        const shared=await deriveSharedKey(kp.privateKey,peerPub);
        const {ciphertext,iv}=await encryptMessage("test message",shared);
        const decrypted=await decryptMessage(ciphertext,iv,shared);
        expect(decrypted).toBe("test message");
    });


  it("wrong key fails to decrypt", async () => {
    const kp = await generateUserKeyPair();
    const peer = await generateUserKeyPair();
    const wrong = await generateUserKeyPair();
    const peerPub = await importPublicKey(await exportPublicKey(peer.publicKey));
    const wrongPub = await importPublicKey(await exportPublicKey(wrong.publicKey));
    const shared = await deriveSharedKey(kp.privateKey, peerPub);
    const wrongShared = await deriveSharedKey(kp.privateKey, wrongPub);
    const { ciphertext, iv } = await encryptMessage("secret", shared);
    await expect(decryptMessage(ciphertext, iv, wrongShared)).rejects.toThrow();
  });
})