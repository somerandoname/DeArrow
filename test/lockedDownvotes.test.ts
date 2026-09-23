import Config from "../src/config/config";
import { VideoID } from "../maze-utils/src/video";
import {
    isLockedTitleDownvoted,
    isLockedThumbnailDownvoted,
    toggleLockedTitleDownvote,
    toggleLockedThumbnailDownvote,
    removeLockedTitleDownvote,
    removeLockedThumbnailDownvote,
    isTitleDownvoted,
    isThumbnailDownvoted,
    addTitleDownvote,
    addThumbnailDownvote,
    removeTitleDownvote,
    removeThumbnailDownvote
} from "../src/utils/lockedDownvotes";

(global as any).chrome = {
    storage: {
        local: {
            set: jest.fn().mockResolvedValue(undefined)
        }
    }
};

describe("Locked Downvotes Unit Tests", () => {
    const videoID = "testVideo123" as VideoID;

    beforeEach(() => {
        Config.local = {
            navigationApiAvailable: false,
            unsubmitted: {},
            downvotedLocked: {}
        };
        Config.cachedLocalStorage = Config.local;
    });

    it("should toggle locked title downvote status", () => {
        const title = "Locked Test Title";
        expect(isLockedTitleDownvoted(videoID, title)).toBe(false);

        const downvoted = toggleLockedTitleDownvote(videoID, title);
        expect(downvoted).toBe(true);
        expect(isLockedTitleDownvoted(videoID, title)).toBe(true);

        const undownvoted = toggleLockedTitleDownvote(videoID, title);
        expect(undownvoted).toBe(false);
        expect(isLockedTitleDownvoted(videoID, title)).toBe(false);
    });

    it("should toggle locked thumbnail downvote status for custom thumbnail", () => {
        const submission = { original: false as const, timestamp: 12.34 };
        expect(isLockedThumbnailDownvoted(videoID, submission)).toBe(false);

        const downvoted = toggleLockedThumbnailDownvote(videoID, submission);
        expect(downvoted).toBe(true);
        expect(isLockedThumbnailDownvoted(videoID, submission)).toBe(true);

        const undownvoted = toggleLockedThumbnailDownvote(videoID, submission);
        expect(undownvoted).toBe(false);
        expect(isLockedThumbnailDownvoted(videoID, submission)).toBe(false);
    });

    it("should toggle locked thumbnail downvote status for original thumbnail", () => {
        const submission = { original: true as const };
        expect(isLockedThumbnailDownvoted(videoID, submission)).toBe(false);

        const downvoted = toggleLockedThumbnailDownvote(videoID, submission);
        expect(downvoted).toBe(true);
        expect(isLockedThumbnailDownvoted(videoID, submission)).toBe(true);

        const undownvoted = toggleLockedThumbnailDownvote(videoID, submission);
        expect(undownvoted).toBe(false);
        expect(isLockedThumbnailDownvoted(videoID, submission)).toBe(false);
    });

    it("should remove locked title and thumbnail downvotes", () => {
        const title = "Title To Remove";
        const submission = { original: true as const };

        toggleLockedTitleDownvote(videoID, title);
        toggleLockedThumbnailDownvote(videoID, submission);

        expect(isLockedTitleDownvoted(videoID, title)).toBe(true);
        expect(isLockedThumbnailDownvoted(videoID, submission)).toBe(true);

        removeLockedTitleDownvote(videoID, title);
        expect(isLockedTitleDownvoted(videoID, title)).toBe(false);

        removeLockedThumbnailDownvote(videoID, submission);
        expect(isLockedThumbnailDownvoted(videoID, submission)).toBe(false);
        expect(Config.local!.downvotedLocked[videoID]).toBeUndefined();
    });

    it("should add title downvote and detect via isTitleDownvoted", () => {
        const title = "Unlocked Title To Downvote";
        expect(isTitleDownvoted(videoID, title)).toBe(false);

        addTitleDownvote(videoID, title);
        expect(isTitleDownvoted(videoID, title)).toBe(true);

        // Adding again should not duplicate
        addTitleDownvote(videoID, title);
        expect(Config.local!.downvotedLocked[videoID]?.titles?.length).toBe(1);

        removeTitleDownvote(videoID, title);
        expect(isTitleDownvoted(videoID, title)).toBe(false);
    });

    it("should add thumbnail downvote and detect via isThumbnailDownvoted", () => {
        const submission = { original: false as const, timestamp: 45.67 };
        expect(isThumbnailDownvoted(videoID, submission)).toBe(false);

        addThumbnailDownvote(videoID, submission);
        expect(isThumbnailDownvoted(videoID, submission)).toBe(true);

        // Adding again should not duplicate
        addThumbnailDownvote(videoID, submission);
        expect(Config.local!.downvotedLocked[videoID]?.thumbnails?.length).toBe(1);

        removeThumbnailDownvote(videoID, submission);
        expect(isThumbnailDownvoted(videoID, submission)).toBe(false);
    });
});
