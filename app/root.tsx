import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import cameraCss from "react-html5-camera-photo/build/css/index.css";
import AudioPlayerCss from "react-h5-audio-player/lib/styles.css";
import BottomSheetCss from "react-spring-bottom-sheet/dist/style.css";

import { getUser } from "./session.server";
import styles from "~/styles/global.css";
import tailwindPreflightCss from "~/styles/scopedTailwindPreflight.css";

export const links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: tailwindStylesheetUrl },
        { rel: "stylesheet", href: tailwindPreflightCss },
        { rel: "stylesheet", href: cameraCss },
        { rel: "stylesheet", href: AudioPlayerCss },
        { rel: "stylesheet", href: BottomSheetCss },
        { rel: "stylesheet", href: "https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" },
        { rel: "stylesheet", href: styles },
    ];
};

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "Storybites",
    viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
    user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
    return json<LoaderData>({
        user: await getUser(request),
    });
};

export default function App() {
    return (
        <html lang="en" className="h-full">
            <head>
                <Meta />
                <Links />
            </head>
            <body className="h-full">
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
