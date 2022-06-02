import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import type { StoryData } from "~/models/stories.server";
import { getStory } from "~/models/stories.server";
import { Link, useLoaderData } from "@remix-run/react";
import { Title, Image, Loader, ActionIcon } from "@mantine/core";
import AudioPlayer from "react-h5-audio-player";
import { ChevronLeft } from "tabler-icons-react";

type LoaderData = {
    story: StoryData | null;
};

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.story) {
        return json({ story: null });
    }

    const story = await getStory(params.story);

    return json<LoaderData>({
        story,
    });
};

export default function Story() {
    const { story } = useLoaderData<LoaderData>();

    return (
        <div>
            {story && (
                <>
                    <ActionIcon className="flex w-auto justify-start" component={Link} to="/stories">
                        <ChevronLeft size={14} /> Back to all stories
                    </ActionIcon>
                    <Title order={3}>{story.title}</Title>
                    <Title order={4}>{story.summary}</Title>
                    <Image width={200} height={120} src={story.imageUrl} withPlaceholder />
                    <AudioPlayer src={story.audioUrl} showJumpControls={false} />
                </>
            )}
            {!story && <Loader />}
        </div>
    );
}
