import Config from "../config/config";
import { getHash } from "../../maze-utils/src/hash";

let cachedPublicUserID: string | null = null;
let lastUserID: string | null = null;

export async function getPublicUserID(): Promise<string | null> {
    const userID = Config.config?.userID;
    if (!userID) return null;
    if (cachedPublicUserID && lastUserID === userID) {
        return cachedPublicUserID;
    }
    lastUserID = userID;
    cachedPublicUserID = await getHash(userID);
    return cachedPublicUserID;
}

export function getCachedPublicUserID(): string | null {
    return cachedPublicUserID;
}

export async function isOwnSubmission(userID?: string): Promise<boolean> {
    if (!userID) return false;
    const publicUserID = await getPublicUserID();
    return !!publicUserID && publicUserID === userID;
}
