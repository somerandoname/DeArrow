import Config from "../src/config/config";
import {
    isUserSuppressed,
    suppressUser,
    unsuppressUser,
    toggleUserSuppression
} from "../src/utils/suppressedUsers";

(global as any).chrome = {
    storage: {
        sync: {
            set: jest.fn().mockResolvedValue(undefined)
        }
    }
};

describe("Suppressed Users Unit Tests", () => {
    const userID1 = "user111111111111111111111";
    const userID2 = "user222222222222222222222";

    beforeEach(() => {
        Config.config = {
            suppressedUserIDs: []
        } as any;
        Config.cachedSyncConfig = Config.config;
    });

    it("should correctly identify suppressed users", () => {
        expect(isUserSuppressed(userID1)).toBe(false);
        expect(isUserSuppressed(undefined)).toBe(false);

        Config.config!.suppressedUserIDs = [userID1];
        expect(isUserSuppressed(userID1)).toBe(true);
        expect(isUserSuppressed(userID2)).toBe(false);
    });

    it("should add a user to suppressedUserIDs", () => {
        suppressUser(userID1);
        expect(isUserSuppressed(userID1)).toBe(true);
        expect(Config.config!.suppressedUserIDs).toContain(userID1);

        // Suppressing again should not duplicate
        suppressUser(userID1);
        expect(Config.config!.suppressedUserIDs.length).toBe(1);
    });

    it("should remove a user from suppressedUserIDs", () => {
        suppressUser(userID1);
        suppressUser(userID2);
        expect(Config.config!.suppressedUserIDs.length).toBe(2);

        unsuppressUser(userID1);
        expect(isUserSuppressed(userID1)).toBe(false);
        expect(isUserSuppressed(userID2)).toBe(true);
        expect(Config.config!.suppressedUserIDs).not.toContain(userID1);
    });

    it("should toggle user suppression status", () => {
        const nowSuppressed = toggleUserSuppression(userID1);
        expect(nowSuppressed).toBe(true);
        expect(isUserSuppressed(userID1)).toBe(true);

        const nowUnsuppressed = toggleUserSuppression(userID1);
        expect(nowUnsuppressed).toBe(false);
        expect(isUserSuppressed(userID1)).toBe(false);
    });
});
