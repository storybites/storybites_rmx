import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useParams } from "@remix-run/react";
import type { LatLngBounds } from "leaflet";
import { useEffect } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { usePosition } from "use-position";
import MapContainer from "~/components/Map/Map.client";
import StoriesPage from "~/components/StoryPane/StoryPane";
import useClientComponent from "~/hooks/useClientComponent";
import useDebouncedCallback from "~/hooks/useDebounceCallback";
import type { GetStories, Stories } from "~/models/stories.server";
import { getStories } from "~/models/stories.server";

export const action: ActionFunction = async ({ request }) => {
    const body = await request.formData();

    switch (request.method) {
        case "POST": {
            let payload: GetStories | null = null;

            const latitude = body.get("latitude");
            const longitude = body.get("longitude");
            if (latitude && longitude) {
                payload = {
                    coords: "center",
                    lat: parseFloat(latitude.toString()),
                    long: parseFloat(longitude.toString()),
                };
            }

            const locationBounds = body.get("locationBounds");
            if (locationBounds) {
                const data = JSON.parse(locationBounds.toString());
                payload = {
                    coords: "bounds",
                    northEast: data.northEast,
                    southWest: data.southWest,
                };
            }

            if (payload) {
                const stories = await getStories(payload);
                return json({
                    stories,
                });
            }
            return [];
        }
    }

    return null;
};

export default function StoriesView() {
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

    const onUpdateLocation = useDebouncedCallback((bounds: LatLngBounds) => {
        storiesFetcher.submit(
            {
                locationBounds: JSON.stringify({
                    northEast: {
                        lat: bounds.getNorthEast().lat,
                        long: bounds.getNorthEast().lng,
                    },
                    southWest: {
                        lat: bounds.getSouthWest().lat,
                        long: bounds.getSouthWest().lng,
                    },
                }),
            },
            { method: "post" }
        );
    }, 1500);

    return (
        <>
            <div className="h-full w-full bg-white">
                <div
                    className="absolute top-0 left-0 z-[9999] box-border hidden h-full w-1/5 bg-white sm:block"
                    style={{ minWidth: 300 }}
                >
                    <StoriesPage showStoriesList={!params.story} stories={stories} />
                </div>
                <div className="mr-4 h-full w-full">
                    <Map stories={storiesFetcher.data?.stories ?? []} onUpdateLocationBounds={onUpdateLocation} />
                </div>
                <BottomSheet
                    open
                    className="block sm:hidden"
                    blocking={false}
                    snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight - maxHeight / 4]}
                >
                    <StoriesPage showStoriesList={!params.story} stories={stories} />
                </BottomSheet>
            </div>
        </>
    );
}
