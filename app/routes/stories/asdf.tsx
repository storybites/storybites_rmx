import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  console.log("Asdf");
  return json({
    stories: [
      {
        slug: "my-first-posasdfasdft",
        title: "My First Post",
      },
      {
        slug: "90s-mixtasdfasdfasdfape",
        title: "A Mixtape I Made Just For You",
      },
    ],
  });
};

export default function Stories() {
  const data = useLoaderData();
  console.log(data);
  return <div>i should list all stories here</div>;
}
