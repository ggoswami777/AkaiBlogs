"use client";

import { useEffect, useState } from "react";
import { exportPublicKey, generateUserKeyPair } from "./crypto/crypto";
import { getPrivateKey, storePrivateKey } from "./crypto/keyStorage";
import { userProfileStore } from "@/store/useProfileStore";
 
export function useE2EE() {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { profile } = userProfileStore();

    useEffect(() => {
        if (!profile?.id) return;

        async function init() {
            try {
                const existingKey = await getPrivateKey(profile.id);
                if (existingKey) {
                    setIsReady(true);
                    return;
                }
                const keyPair = await generateUserKeyPair();
                await storePrivateKey(profile.id, keyPair.privateKey);

                // export and upload public key
                const publicKeyBase64 = await exportPublicKey(keyPair.publicKey);
                const res = await fetch("/api/profile/public-key", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ publicKey: publicKeyBase64 }),
                });
                if (!res.ok) {
                    throw new Error("Failed to upload public key to server");
                }
                setIsReady(true);
            } catch (error) {
                console.error("E2EE init error:", error);
                setError("Failed to initialize encryption");
                setIsReady(true);
            }
        }
        init();
    }, [profile?.id]);

    return { isReady, error };
}
