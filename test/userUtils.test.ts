import Config from "../src/config/config";
import { getPublicUserID, isOwnSubmission } from "../src/utils/userUtils";
import { getHash } from "../maze-utils/src/hash";

(global as any).chrome = {
    runtime: {
        sendMessage: jest.fn()
    }
};

describe("User Utils Unit Tests", () => {
    const rawUserID = "testUser1234567890";

    beforeEach(() => {
        Config.config = {
            userID: rawUserID
        } as any;
    });

    it("should return null publicUserID when Config.config.userID is null", async () => {
        Config.config = { userID: null } as any;
        expect(await getPublicUserID()).toBeNull();
        expect(await isOwnSubmission("someHashedID")).toBe(false);
    });

    it("should correctly identify own submission by matching public user ID hash", async () => {
        Config.config = { userID: rawUserID } as any;
        const expectedHash = await getHash(rawUserID);
        expect(await isOwnSubmission(expectedHash)).toBe(true);
        expect(await isOwnSubmission("otherUserHash")).toBe(false);
        expect(await isOwnSubmission(undefined)).toBe(false);
    });
});
