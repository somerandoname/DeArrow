import * as React from "react";
import { ThumbnailType } from "./ThumbnailComponent";
import { VideoID } from "../../maze-utils/src/video";
import { ThumbnailSubmission } from "../thumbnails/thumbnailData";
import { ThumbnailSelectionComponent } from "./ThumbnailSelectionComponent";

export interface ThumbnailDrawerComponentProps {
    video: HTMLVideoElement;
    videoId: VideoID;
    existingSubmissions: RenderedThumbnailSubmission[];
    selectedThumbnailIndex: number;
    upvotedThumbnailIndex: number;
    onSelect: (submission: ThumbnailSubmission, index: number) => void;
    onUpvote: (index: number) => void;
    onRemove?: (timestamp: number, index: number) => void;
    actAsVip: boolean;
}

interface NoTimeRenderedThumbnailSubmission {
    type: ThumbnailType.CurrentTime | ThumbnailType.Original;
}

interface TimeRenderedThumbnailSubmission {
    timestamp: number;
    type: ThumbnailType.SpecifiedTime;
}

export type RenderedThumbnailSubmission = (NoTimeRenderedThumbnailSubmission | TimeRenderedThumbnailSubmission) & {
    votable: boolean;
    locked: boolean;
    isUnsubmitted?: boolean;
};

export const ThumbnailDrawerComponent = (props: ThumbnailDrawerComponentProps) => {
    return (
        <>
            {getThumbnails(props, props.selectedThumbnailIndex)}
        </>
    );
};

function getThumbnails(props: ThumbnailDrawerComponentProps, 
        selectedThumbnail: number): JSX.Element[] {
    const thumbnails: JSX.Element[] = [];
    const renderCount = props.existingSubmissions.length;
    for (let i = 0; i < renderCount; i++) {
        const submission = props.existingSubmissions[i];
        const time = submission.type === ThumbnailType.SpecifiedTime ? 
            (submission as TimeRenderedThumbnailSubmission).timestamp : undefined;

        thumbnails.push(
            <ThumbnailSelectionComponent
                video={props.video}
                selected={selectedThumbnail === i}
                upvoted={props.upvotedThumbnailIndex === i}
                onClick={(submission) => {
                    props.onSelect(submission, i);
                }}
                onUpvote={() => {
                    props.onUpvote(i);
                }}
                onRemove={time != null && submission.isUnsubmitted ? () => {
                    props.onRemove?.(time, i);
                } : undefined}
                isUnsubmitted={submission.isUnsubmitted}
                type={submission.type}
                videoID={props.videoId}
                time={time}
                votable={submission.votable}
                locked={submission.locked}
                actAsVip={props.actAsVip}
                key={time ? `T${time}` : `I${i}`}
            ></ThumbnailSelectionComponent>
        );
    }

    return thumbnails;
}