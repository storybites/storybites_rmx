import type { Stories } from "@prisma/client";
import { prisma } from "~/db.server";
import { getImageUrl } from "./firebase.server";

export type StoryData = Stories & { imageUrl: string };
export type { Stories } from "@prisma/client";

export async function getStory(id: string): Promise<StoryData | null> {
    const story = await prisma.stories.findFirst({
        where: { id },
    });
    if (!story) {
        return null;
    }

    const imageUrl = await getImageUrl(story?.imageName);
    return Object.assign({}, story, { imageUrl: imageUrl });
}

interface IGetStoriesBase {
    coords: "center" | "bounds";
}

interface IGetStoriesCenter extends IGetStoriesBase {
    coords: "center";
    lat: number;
    long: number;
}

interface IGetStoriesBounds extends IGetStoriesBase {
    coords: "bounds";
    northEast: {
        lat: number;
        long: number;
    };
    southWest: {
        lat: number;
        long: number;
    };
}

export type GetStories = IGetStoriesCenter | IGetStoriesBounds;

export function getStories(coords: GetStories) {
    const { latMin, latMax, longMin, longMax } =
        coords.coords === "center"
            ? getBoundsFromLatLng(coords.lat, coords.long, 5)
            : getBoundsfromCorners(coords.northEast, coords.southWest);

    return prisma.stories.findMany({
        where: {
            lat: {
                gte: latMin,
                lte: latMax,
            },
            long: {
                gte: longMin,
                lte: longMax,
            },
        },
    });
}

function getBoundsFromLatLng(lat: number, long: number, radiusInKm: number) {
    const latChange = radiusInKm / 111.2;
    const longChange = Math.abs(Math.cos(lat * (Math.PI / 180)));
    return {
        latMin: lat - latChange,
        latMax: lat + latChange,
        longMin: long - longChange,
        longMax: long + longChange,
    };
}

function getBoundsfromCorners(northEast: IGetStoriesBounds["northEast"], southWest: IGetStoriesBounds["southWest"]) {
    return {
        latMin: southWest.lat,
        latMax: northEast.lat,
        longMin: southWest.long,
        longMax: northEast.lat,
    };
}

// export function createNote({
//   body,
//   title,
//   userId,
// }: Pick<Note, "body" | "title"> & {
//   userId: User["id"];
// }) {
//   return prisma.note.create({
//     data: {
//       title,
//       body,
//       user: {
//         connect: {
//           id: userId,
//         },
//       },
//     },
//   });
// }

// export function deleteNote({
//   id,
//   userId,
// }: Pick<Note, "id"> & { userId: User["id"] }) {
//   return prisma.note.deleteMany({
//     where: { id, userId },
//   });
// }
