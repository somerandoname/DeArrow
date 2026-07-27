import Config from "../config/config";
import { chromeP } from "../../maze-utils/src/browserApi";
import { logError } from "./logger";

export function isUserSuppressed(userID?: string): boolean {
    if (!userID || !Config.config?.suppressedUserIDs) return false;
    return Config.config.suppressedUserIDs.includes(userID);
}

export function suppressUser(userID: string): void {
    if (!userID) return;
    Config.config!.suppressedUserIDs ??= [];
    if (!Config.config!.suppressedUserIDs.includes(userID)) {
        Config.config!.suppressedUserIDs.push(userID);
        saveSuppressedUserIDs();
    }
}

export function unsuppressUser(userID: string): void {
    if (!userID || !Config.config?.suppressedUserIDs) return;
    const index = Config.config.suppressedUserIDs.indexOf(userID);
    if (index !== -1) {
        Config.config.suppressedUserIDs.splice(index, 1);
        saveSuppressedUserIDs();
    }
}

export function toggleUserSuppression(userID: string): boolean {
    if (!userID) return false;
    if (isUserSuppressed(userID)) {
        unsuppressUser(userID);
        return false;
    } else {
        suppressUser(userID);
        return true;
    }
}

function saveSuppressedUserIDs(): void {
    Config.forceSyncUpdate("suppressedUserIDs");
}
