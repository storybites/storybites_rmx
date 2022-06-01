import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useParams } from "@remix-run/react";
import MapContainer from "~/components/Map/Map.client";
import useClientComponent from "~/hooks/useClientComponent";

export const loader = async () => {
  return json({
    stories: [
      {
        slug: "my-first-post",
        title: "My First Post",
      },
      {
        slug: "90s-mixtape",
        title: "A Mixtape I Made Just For You",
      },
    ],
  });
};

export default function Stories() {
  const data = useLoaderData();
  const Map = useClientComponent(MapContainer);
  const params = useParams();

  return (
    <div className="h-full w-full bg-white">
      <div className="absolute top-0 left-0 z-[9999] box-border h-full w-1/5 bg-white p-4">
        {params.story ? null : <div>all stories here</div>}

        <Outlet />
      </div>
      <div className="mr-4 h-full w-full">
        <Map />
        {/* <div>map goes here</div> */}
      </div>
    </div>
  );
}
