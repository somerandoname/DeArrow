import Config from "../config/config";
import { VideoID } from "../../maze-utils/src/video";
import { ThumbnailSubmission } from "../thumbnails/thumbnailData";

export function isLockedTitleDownvoted(videoID: VideoID, title: string): boolean {
    if (!Config.local?.downvotedLocked?.[videoID]?.titles) return false;
    return Config.local.downvotedLocked[videoID].titles!.includes(title);
}

export function isLockedThumbnailDownvoted(videoID: VideoID, submission: ThumbnailSubmission): boolean {
    const list = Config.local?.downvotedLocked?.[videoID]?.thumbnails;
    if (!list) return false;

    if (submission.original) {
        return list.some((t) => t.original);
    } else {
        return list.some((t) => !t.original && t.timestamp === submission.timestamp);
    }
}

export function toggleLockedTitleDownvote(videoID: VideoID, title: string): boolean {
    Config.local!.downvotedLocked ??= {};
    const videoEntry = Config.local!.downvotedLocked[videoID] ??= {};
    videoEntry.titles ??= [];

    const index = videoEntry.titles.indexOf(title);
    let nowDownvoted = false;
    if (index !== -1) {
        videoEntry.titles.splice(index, 1);
        nowDownvoted = false;
    } else {
        videoEntry.titles.push(title);
        nowDownvoted = true;
    }

    cleanEmptyLockedEntry(videoID);
    Config.forceLocalUpdate("downvotedLocked");
    return nowDownvoted;
}

export function toggleLockedThumbnailDownvote(videoID: VideoID, submission: ThumbnailSubmission): boolean {
    Config.local!.downvotedLocked ??= {};
    const videoEntry = Config.local!.downvotedLocked[videoID] ??= {};
    videoEntry.thumbnails ??= [];

    let index = -1;
    if (submission.original) {
        index = videoEntry.thumbnails.findIndex((t) => t.original);
    } else {
        index = videoEntry.thumbnails.findIndex((t) => !t.original && t.timestamp === submission.timestamp);
    }

    let nowDownvoted = false;
    if (index !== -1) {
        videoEntry.thumbnails.splice(index, 1);
        nowDownvoted = false;
    } else {
        if (submission.original) {
            videoEntry.thumbnails.push({ original: true });
        } else {
            videoEntry.thumbnails.push({ original: false, timestamp: submission.timestamp });
        }
        nowDownvoted = true;
    }

    cleanEmptyLockedEntry(videoID);
    Config.forceLocalUpdate("downvotedLocked");
    return nowDownvoted;
}

export function removeLockedTitleDownvote(videoID: VideoID, title: string): void {
    const list = Config.local?.downvotedLocked?.[videoID]?.titles;
    if (!list) return;
    const index = list.indexOf(title);
    if (index !== -1) {
        list.splice(index, 1);
        cleanEmptyLockedEntry(videoID);
        Config.forceLocalUpdate("downvotedLocked");
    }
}

export function removeLockedThumbnailDownvote(videoID: VideoID, submission: ThumbnailSubmission): void {
    const list = Config.local?.downvotedLocked?.[videoID]?.thumbnails;
    if (!list) return;

    let index = -1;
    if (submission.original) {
        index = list.findIndex((t) => t.original);
    } else {
        index = list.findIndex((t) => !t.original && t.timestamp === submission.timestamp);
    }

    if (index !== -1) {
        list.splice(index, 1);
        cleanEmptyLockedEntry(videoID);
        Config.forceLocalUpdate("downvotedLocked");
    }
}

function cleanEmptyLockedEntry(videoID: VideoID): void {
    const entry = Config.local?.downvotedLocked?.[videoID];
    if (entry) {
        if ((!entry.titles || entry.titles.length === 0) && (!entry.thumbnails || entry.thumbnails.length === 0)) {
            delete Config.local!.downvotedLocked[videoID];
        }
    }
}
