import { Navbar, ThemeIcon, Title } from "@mantine/core";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useFetcher, useParams } from "@remix-run/react";
import { useEffect } from "react";
import { Lamp2 } from "tabler-icons-react";
import { usePosition } from "use-position";
import MapContainer from "~/components/Map/Map.client";
import StoryItem from "~/components/StoryList/StoryList";
import useClientComponent from "~/hooks/useClientComponent";
import type { Stories } from "~/models/stories.server";
import { getStories } from "~/models/stories.server";

export const action: ActionFunction = async ({ request }) => {
    const body = await request.formData();

    switch (request.method) {
        case "POST": {
            const latitude = body.get("latitude");
            const longitude = body.get("longitude");
            if (latitude && longitude) {
                const stories = await getStories(parseFloat(latitude.toString()), parseFloat(longitude.toString()));

                return json({
                    stories,
                });
            }
            return [];
        }
    }

    return null;
};

export default function StoriesPage() {
    const Map = useClientComponent(MapContainer);
    const params = useParams();
    const storiesFetcher = useFetcher();
    const { latitude, longitude } = usePosition(false);
    useEffect(() => {
        if (latitude && longitude) {
            storiesFetcher.submit(
                {
                    latitude: `${latitude}`,
                    longitude: `${longitude}`,
                },
                { method: "post" }
            );
        }
    }, [latitude, longitude]);

    const stories: Stories[] = storiesFetcher.data?.stories ?? [];
    return (
        <div className="h-full w-full bg-white">
            <div className="absolute top-0 left-0 z-[9999] box-border h-full w-1/5 bg-white">
                <Navbar p="xs" className="h-full w-full  p-4">
                    <Navbar.Section className="flex items-center gap-1">
                        <ThemeIcon color="violet">
                            <Lamp2 />
                        </ThemeIcon>
                        <Title order={2}>Storybites</Title>
                    </Navbar.Section>
                    <Navbar.Section grow mt="md">
                        {!params.story &&
                            stories.length > 0 &&
                            stories.map((story) => {
                                return <StoryItem key={story.id} story={story} />;
                            })}
                        <Outlet />
                    </Navbar.Section>
                </Navbar>
            </div>
            <div className="mr-4 h-full w-full">
                <Map stories={storiesFetcher.data?.stories ?? []} />
            </div>
        </div>
    );
}
